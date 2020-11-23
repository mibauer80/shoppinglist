const mixins = {
    methods: {
      function_call(method, args = []) {
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
      pushModal(type, content) {
        this.modal.status = true,
          this.modal.title = content.title,
          this.modal.text = content.messages,
          this.modal.options = content.options
      },
      deleteModal() {
        this.loading_itemSubmit = false;
        this.modalActionLoading = false;
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