new Vue({
  el: '#app',
  components: {
    'icon': { template: '<svg><use :xlink:href="use"/></svg>', props: ['use'] }
  },

  data() {
    return {
      rating: 4,
      menu: null,
      modal: false,
      companies: [],
      countries: {},
      categories: {}
    }
  },

  computed: {
    list() {
      let { countries, categories } = this.filters

      return this.companies.filter(({ country, keywords, rating }) => {
        if (rating < this.rating) return false
        if (countries.length && !~countries.indexOf(country)) return false
        return !categories.length || categories.every(cat => ~keywords.indexOf(cat))
      })
    },

    filters() {
      return {
        list: { countries: this.countries, categories: this.categories },
        countries: Object.keys(this.countries).filter(c => this.countries[c]),
        categories: Object.keys(this.categories).filter(c => this.categories[c])
      }
    }
  },

  methods: {
    setFilter(set, filter) {
      let active = this[set][filter]
      this[set][filter] = !active
      if (set !== 'categories') return;

      setTimeout(() => {
        Object.keys(this.categories).forEach(category => {
          this.categories[category] = filter === category && !active
        })
      }, 200)
    },

    clearFilter(set) {
      Object.keys(this[set]).forEach(filter => {
        this[set][filter] = false
      })
    },

    setMenu(menu) {
      this.menu = (this.menu === menu) ? null : menu
    }
  },

  beforeMount() {
    fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/450744/mock-data.json')
      .then(response => response.json())
      .then(companies => {
        this.companies = companies

        companies.forEach(({ country, keywords }) => {
          if (!this.countries.hasOwnProperty(country)) this.$set(this.countries, country, false)

          keywords.forEach(category => {
            if (!this.categories.hasOwnProperty(category)) this.$set(this.categories, category, false)
          })
        })
      })
  }
})

// load svg spritesheet
fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/450744/mock-logos.svg')
  .then(response => response.text()).then(sprite => {
    let figure = document.createElement('figure')
    figure.style.display = 'none'
    figure.innerHTML = sprite
    document.body.insertBefore(figure, document.body.children[0])
  })
