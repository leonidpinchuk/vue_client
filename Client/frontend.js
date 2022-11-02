import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.4/dist/vue.esm.browser.js'


Vue.component("loader", {
    template:
        '<div style="display: flex:justify-content: center;align-items: center">\n' +
        '        <div class="spinner-border" role="status">\n' +
        '            <span class="sr-only">Loading...</span>\n' +
        '        </div>\n' +
        '    </div>'

})

new Vue({
    el: "#app",
    data() {
        return {
            loading: false,
            form: {
                name: "",
                value: ""
            },
            contacts: []
        }
    },
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim() && this.form.value1.trim()
        }
    },
    methods: {
        async createContact() {
            const {...contact} =this.form

            const newContact = await request("/api/contacts", "POST", contact)

            this.contacts.push(newContact)

            this.form.name = this.form.value = this.form.value1 = this.form.date1 = this.form.date2 = ""
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id)
            const updated = await request(`/api/contacts/${id}`, "PUT", {
                ...contact,
                marked: true
            })
            contact.marked = updated.marked
        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, "DELETE")
            this.contacts = this.contacts.filter(c => c.id !== id)
        }
        },
        async mounted() {
            this.loading = true
            this.contacts = await request("/api/contacts")
            this.loading = false
        },

})

async function request(url, method = "GET", data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(data)
        }

        const response = await fetch(url,{
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.warn("Error", e.message)
    }
}