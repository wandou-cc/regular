const vscode = require('vscode');
const { getSelectText } = require('./utils/utils')
const axios = require('axios')
const { getLanguage } = require("./i18n/index")
const language = getLanguage()
// 创建bar
var bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
bar.show();
let baseUrl = 'http://120.48.19.18:80'

function isArray(result) {
    let resultArr = []
    result.forEach(item => {
        resultArr.push(item.name + " -reg-:  " + item.value)
    })
    show(resultArr)
}

function show(resultArr) {
    bar.text = `$(rocket) ${language.achieve}`
    vscode.window.showQuickPick(resultArr, {
        ignoreFocusOut: true,
        matchOnDescription: true,
        matchOnDetail: true
    }).then(function (msg) {
        // 进行替换
        let editor = vscode.window.activeTextEditor;
        editor.selections.forEach((item) => {
            editor.edit(editBuilder => {
                editBuilder.replace(item, msg.split(' -reg-:  ')[1]);
            })
        })
        // 替换完成之后 进行 弹窗 
        vscode.window.showInformationMessage(`Tip:${language.submitSuccess}`, `${language.betterRegularity}`, `${language.submitFeedback}`).then(result => {
            if (result === `${language.betterRegularity}`) {
                vscode.env.openExternal(vscode.Uri.parse(`https://github.com/wandou-cc/regular/issues/new?title=更优的正则:${msg.split(':')[0]}`))
            } else if (result === `${language.submitFeedback}`) {
                vscode.env.openExternal(vscode.Uri.parse(`https://github.com/wandou-cc/regular/issues/new?title=提交建议`))
            }
        });
    })
}

async function main() {
    // 只能输入 10 个字
    let keyWord = getSelectText();
    if (!keyWord) return
    if (keyWord.length >= 10) {
        vscode.window.showWarningMessage(`${language.maxCharacter}`)
        return
    }
    bar.text = `$(rocket) ${language.later}...`
    let res = await axios({ headers: {}, method: "post", url: baseUrl + "/api/getReg", data: { name: keyWord,page:1,size:9999 } })
    let data = res.data
    if (data.code === 0 && data.data.length !== 0) {
        isArray(data.data)
    } else if (data.data.length === 0) {
        vscode.window.showWarningMessage(`Tip:${language.submitNewTip}`, `${language.submitNew}`).then(result => {
            if (result === `${language.submitNew}`) {
                vscode.env.openExternal(vscode.Uri.parse(`https://github.com/wandou-cc/regular/issues/new?title=反馈添加:${keyWord}`))
            }
        });
        bar.text = `Tip:${language.submitNew}`
    } else {
        vscode.window.showErrorMessage(`error_code:${data.code}`, `${language.submitBug}`).then(result => {
            if (result === `${language.submitBug}`) {
                vscode.env.openExternal(vscode.Uri.parse(`https://github.com/wandou-cc/regular/issues/new?title=接口异常:${data.code}`))
            }
        });
        bar.text = `error:${data.code}`
    }
}

let keyReg = vscode.commands.registerCommand('regular.search', function () {
    main()
});


module.exports = {
    keyReg
}