window.addEventListener("load", init);
function init() {
  trimCodes();
  addLineNums();
  getDefaultColorJSON((d) => {
    colorScheme = d;
    drawColorCSS();
  });

  makeColorSyntax_Python();
}

function trimCodes() {
  let pres = $("pre.code-preview");
  pres.forEach((pre) => {
    let code = pre.$1("code");
    code.innerHTML = code.innerHTML.trim();
  });
}

function addLineNums() {
  let pres = $("pre.code-preview");
  pres.forEach((pre) => {
    let nums = pre.$1("code").textContent.split("\n").length;
    pre.$1(".line-number").innerHTML = Array(nums)
      .fill(0)
      .map((v, i) => i + 1)
      .join("\n");
  });
}

defaultColorScheme = {};
colorScheme = {};
// JSONデータを取得する関数
function getDefaultColorJSON(callback) {
  fetch("monokai-color-theme.json")
    .then((response) => response.json())
    .then((data) => {
      defaultColorScheme = data;
      callback(data);
    })
    .catch((error) => console.error("Error fetching JSON:", error));
}

function drawColorCSS() {
    let style = $1('#style-color-scheme');
    let styleText = "";

    colorScheme.tokenColors.forEach(c=>{
        let scopes = '';
        if (typeof c.scope == "object") {
            scopes = c.scope;
        } else if (typeof c.scope == "string") {
            scopes = c.scope.split(',');
        } else if (c.scope === undefined) {
            scopes = ['*']
        }
        scopes = scopes.map(v=>v.trim());

        let styles = {color: null, "font-style": null, "text-decoration": null};
        if (c.settings?.foreground) {
            styles.color = c.settings.foreground;
        }
        if (c.settings?.fontStyle) {
            styles["font-style"] = c.settings.fontStyle;
            styles["text-decoration"] = c.settings.fontStyle;
        }

        styleText += scopes.map(v=>`.color-${v.split('.').join('-')}`).join(",\n");
        styleText += '{\n';
        Object.keys(styles).forEach(s=>{
            if (styles[s]) styleText += `${s}: ${styles[s]};\n`;
        })
        styleText += '}\n';
    })

    let colors = colorScheme.colors
    let codeStyleText = "";
    if (colors["editor.background"]) {
        codeStyleText += `background-color: ${colors["editor.background"]};`
    }
    if (colors["editor.foreground"]) {
        codeStyleText += `color: ${colors["editor.foreground"]};`
    }

    styleText += `.code-preview {
${codeStyleText}
}`

    style.textContent = styleText;
}




function makeColorSyntax_Python() {
    $('code[lang="python"]').forEach(code=>{
        let codeText = code.innerHTML;

        // テキスト
        codeText = codeText.replace(/(".*")/g, `<span class="color-string">$1</span>`)
        codeText = codeText.replace(/('.*')/g, `<span class="color-string">$1</span>`)

        // def
        codeText = codeText.replace(/(def)(\s)/g, `<span class="color-storage-type">$1</span>$2`)
        // class
        codeText = codeText.replace(/(class)(\s)/g, `<span class="color-support-class">$1</span>$2`)
        // 引数名
        codeText = codeText.replace(/((?:def|class)<\/span>\s+[a-zA-Z_][a-zA-Z0-9_]*\s*[\(,][*]*)([a-zA-Z][a-zA-Z0-9_]*)(\s*[,\)=])/g, `$1<span class="color-variable-parameter">$2</span>$3`)
        for (let i=0; i<10; i++) {
            codeText = codeText.replace(/(<span class="color\-variable\-parameter">.+<\/span>\s*,\s*[*]*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*[,\=)])/g, `$1<span class="color-variable-parameter">$2</span>$3`)
        }
        // 特定の引数名
        codeText = codeText.replace(/(\s|\(|\))(self)(\s|\.)/g, `$1<span class="color-variable-parameter">$2</span>$3`)
        // クラス名
        codeText = codeText.replace(/(class<\/span>\s+)([a-zA-Z_][a-zA-Z0-9_]*)(\s*\()/g, `$1<span class="color-entity-name-class">$2</span>$3`)
        // 関数名
        codeText = codeText.replace(/(def<\/span>\s+)([a-zA-Z_][a-zA-Z0-9_]*)(\s*\()/g, `$1<span class="color-entity-name-function">$2</span>$3`)
        //特定の関数名
        codeText = codeText.replace(/([\s\(\)])(zip|print|object)([\s\(\)\,])/g, `$1<span class="color-support-function">$2</span>$3`)
        codeText = codeText.replace(/(<span class="color-entity-name-function">)(__init__)(<\/span>)/g, `<span class="color-support-function">$2</span>`)
        // キーワード
        codeText = codeText.replace(/([^a-zA-Z0-9_])(return|if|for|not|in)([^a-zA-Z0-9_])/g, `$1<span class="color-keyword">$2</span>$3`)
        codeText = codeText.replace(/([^a-zA-Z0-9_])(return|if|for|not|in)([^a-zA-Z0-9_])/g, `$1<span class="color-keyword">$2</span>$3`)
        // 演算子(キーワード)
        codeText = codeText.replace(/([a-zA-Z0-9_\)>]\s*)((?:\+|\*|\/|\=)+)(\s*[\(a-zA-Z0-9])/g, `$1<span class="color-keyword">$2</span>$3`)
        codeText = codeText.replace(/([a-zA-Z0-9_\)>]\s*)((?:\+|\*|\/|\=)+)(\s*[\(a-zA-Z0-9])/g, `$1<span class="color-keyword">$2</span>$3`)
        // ストレージ
        codeText = codeText.replace(/([^a-zA-Z0-9_])(\*+)([a-zA-Z0-9_<])/g, `$1<span class="color-storage">$2</span>$3`)
        // 数字
        codeText = codeText.replace(/([^a-zA-Z0-9_])(\-?[0-9]+(?:\.[0-9*])?)([^a-zA-Z0-9_])/g, `$1<span class="color-constant-numeric">$2</span>$3`)
        codeText = codeText.replace(/([^a-zA-Z0-9_])(None)([^a-zA-Z0-9_])/g, `$1<span class="color-constant-language">$2</span>$3`)
        codeText = codeText.replace(/([^a-zA-Z0-9_])([A-Z][A-Z_0-9]*)([^a-zA-Z0-9_])/g, `$1<span class="color-constant-character">$2</span>$3`)


        code.innerHTML = codeText;
    })
}