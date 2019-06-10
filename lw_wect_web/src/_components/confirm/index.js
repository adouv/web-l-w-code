import MintUI from 'mint-ui'

const confirm = function (title, message, options = {}) {

  let confirm = options.confirm;
  let cancel = options.cancel;

  MintUI.MessageBox.confirm(message, title, options)
    .then(action => {
      if (typeof (confirm) !== 'function') {
        return;
      }
      confirm(action);
    })
    .catch(() => {
      if (typeof (cancel) !== 'function') {
        return;
      }
      cancel();
    });

}

export default confirm;
