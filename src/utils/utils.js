const vscode = require('vscode');

// 获取选中的文字
function getSelectText() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return '';
    }
    let selection = editor.selection;
    return editor.document.getText(selection);
}

module.exports = {
    getSelectText
}