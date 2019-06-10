import './style.css';
/**
 * 外链接进入
 */
export default class linkFrame {
    constructor($stateParams, Base64Service, $sessionStorage) {
        this.$stateParams = $stateParams;
        this.Base64Service = Base64Service;
        this.$sessionStorage = $sessionStorage;
        // this.authService = authService;
        // this.authService.authCookie(this.$state);
        //this.clientService.win.window.setWindowSize(500, 500);
        this.template = ``;
    }

    link(scope, elem) {
        let frameUrl = this.Base64Service.decode(this.$stateParams.urlCode);
        let token = this.$sessionStorage.get('token');
        let account = this.$sessionStorage.get('account');
        let login = this.Base64Service.encode(JSON.stringify({ token: token, user: account }));
        frameUrl += '?loginfo=' + login;
        let template = `<iframe frameborder="0" id="iframeWindow" allowfullscreen="true" allowtransparency="true" name="iframeWindow"  width="100%" height="100%" src="${frameUrl}"></iframe>`;
        if (window['require'] && window['require']('nw.gui')) {
            template = `<webview frameborder="0" id="iframeWindow" allownw allowtransparency name="iframeWindow" width="100%" height="100%" src="${frameUrl}"></webview>`;
        }
        elem.append(template);
        elem.parent().css("overflow", "hidden");
        let iframeWindow = document.getElementById('iframeWindow');
        iframeWindow.addEventListener('load', () => {
            showModulePage();
        });
        iframeWindow.addEventListener('permissionrequest', function(e) {
            if (e.permission === 'fullscreen' || e.permission === 'download') {
                e.request.allow();
            }
        });
        iframeWindow.addEventListener('dialog', function(e) {
            var messageType = e.messageType;
            var messageText = e.messageText;
            var DialogController = e.dialog;
            //lets checki if alert
            if (messageType == 'alert') {
                window.alert(messageText);
            } //emd if
            //if confirm
            else if (messageType == 'confirm') {
                //confirm
                var confirm = window.confirm(messageText);
                //get confirm bool and send to controller
                if (confirm) {
                    //if true send okay to browser
                    DialogController.ok();
                } else {
                    //send cancel with to send false false
                    DialogController.cancel();
                } //end if
            } //end if confirm
            //lastly if its prompt
            else if (messageType == 'prompt') {
                //get user Input
                promptInput = window.prompt(messageText);
                //if null , then means the user clicked cancel
                if (promptInput == null) {
                    //tell browser to cancel
                    DialogController.cancel();
                } else {
                    //feed browser with input data
                    DialogController.ok(promptInput);
                }
            } //end if prompt
        });
    }
}