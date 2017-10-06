new Vue({
  el: '#app',
  components: {
    'icon': { template: '<svg><use :xlink:href="use"/></svg>', props: ['use'] }
  },

  data() {
    return {
      modal: false,
      companies: [],
      dropdown: { height: 0 },
      rating: { min: 10, max: 0 },
      filters: { countries: {}, categories: {}, rating: 0 },
      menus: { countries: false, categories: false, rating: false }
    }
  },

  computed: {
    activeMenu() {
      return Object.keys(this.menus).reduce(($$, set, i) => (this.menus[set]) ? i : $$, -1)
    },

    list() {
      let { countries, categories } = this.activeFilters

      return this.companies.filter(({ country, keywords, rating }) => {
        if (rating < this.filters.rating) return false
        if (countries.length && !~countries.indexOf(country)) return false
        return !categories.length || categories.every(cat => ~keywords.indexOf(cat))
      })
    },

    activeFilters() {
      let { countries, categories } = this.filters

      return {
        countries: Object.keys(countries).filter(c => countries[c]),
        categories: Object.keys(categories).filter(c => categories[c])
      }
    }
  },

  watch: {
    activeMenu(index, from) {
      if (index === from) return;

      this.$nextTick(() => {
        if (!this.$refs.menu || !this.$refs.menu[index]) this.dropdown.height = 0
        else this.dropdown.height = `${this.$refs.menu[index].clientHeight + 16}px`
      })
    }
  },

  methods: {
    setFilter(set, filter, single) {
      let active = this.filters[set][filter]
      this.filters[set][filter] = !active
      if (!single) return;

      setTimeout(() => {
        Object.keys(this.filters[set]).forEach(option => {
          this.filters[set][option] = filter === option && !active
        })
      }, 200)
    },

    clearFilter(single) {
      let filters = (single) ? [single] : Object.keys(this.filters)

      filters.forEach(set => {
        Object.keys(this.filters[set]).forEach(filter => {
          this.filters[set][filter] = false
        })
      })
    },

    setMenu(menu, active) {
      Object.keys(this.menus).forEach(tab => {
        this.menus[tab] = !active && tab === menu
      })
    }
  },

  beforeMount() {
    fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/450744/mock-data.json')
      .then(response => response.json())
      .then(companies => {
        this.companies = companies

        companies.forEach(({ country, keywords, rating }) => {
          this.$set(this.filters.countries, country, false)

          if (this.rating.max < rating) this.rating.max = rating
          if (this.rating.min > rating) {
            this.rating.min = rating
            this.filters.rating = rating
          }

          keywords.forEach(category => {
            this.$set(this.filters.categories, category, false)
          })
        })
      })
  }
})

// inject svg spritesheet
fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/450744/mock-logos.svg')
  .then(response => response.text()).then(sprite => {
    let figure = document.createElement('figure')
    figure.style.display = 'none'
    figure.innerHTML = sprite
    document.body.insertBefore(figure, document.body.children[0])
  })
