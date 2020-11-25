const mixins = {
    methods: {
      function_call(method, args=[]) {      
        this[method](...args);
      },
      pushAlert(type, content) {
        this.alert.status = true,
          this.alert.type = type,
          this.alert.content = content;
        setTimeout(() => {
          this.deleteAlert()
        }, 7000);
      },
      deleteAlert() {
        this.alert.status = false,
          this.alert.type = undefined,
          this.alert.content = [];
      },
      pushModal(content) {
        this.modal.modalActionLoading = false;
        this.modal.status = true,
        this.modal.type = content.type || 'default',
          this.modal.title = content.title || 'Fehler',
          this.modal.text = content.messages,
          this.modal.options = content.options
      },
      deleteModal(args = []) {    
        if ('listItemId' in args) {
          var ci = this.items.findIndex((i) => {
            return i.item_id === args.listItemId;
        });           
        this.items[ci].deleteLoading = false;
      }
        this.loading_itemSubmit = false;
        this.modal.modalActionLoading = false;
        this.modal.status = false,
          this.modal.title = undefined,
          this.modal.text = [],
          this.modal.options = []
      },   
      germanDate(dateString) {
        if (typeof dateString !== 'undefined' && dateString != null) {
        var c = dateString.split('-');
        var monthNames = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
        return c[2] + '. ' + monthNames[Number(c[1])-1] + ' ' + c[0];
        } else {
          return '';
        }
      },
     
    }
  };

  export default mixins