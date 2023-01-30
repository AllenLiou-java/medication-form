module.exports = {
    // 超過多少字符串強制換行
    printWidth: 100,
    // 指定每個縮排的空格數
    tabWidth: 2,
    // 使用tab而不是空格進行縮排
    useTabs: false,
    // 程式碼結尾是否加分號
    semi: true,
    // 是否使用單引號
    singleQuote: true,
    // 物件的key僅在必要時用引號，可選值"<as-needed|consistent|preserve>"
    quoteProps: 'as-needed',
    // 在JSX中使用單引號而不是雙引號
    jsxSingleQuote: false,
    // 多行時盡可能在最後加上逗號。（例如，單行陣列永遠不會出現結尾逗號。） 可选值"<none|es5|all>"，預設none
    trailingComma: 'none',
    // 在物件大括號內兩側是否加上空格 { a:0 }
    bracketSpacing: true,
    // jsx 標籤的反括號需要换行
    jsxBracketSameLine: false,
    // 單個參數的箭頭函數不佳括號  always：(x) => x \ avoid：x => x
    arrowParens: 'avoid',
    // 每個文件格式化的範圍是文件的全部內容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 指定要使用的解析器，不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自動在文件開頭插入 @prettier
    insertPragma: false,
    // 使用預設的換行標準 always\never\preserve
    proseWrap: 'preserve',
    // 指定HTML文件的全局空格敏感度 css\strict\ignore
    htmlWhitespaceSensitivity: 'css',
    // Vue文件脚本和样式标签缩进
    vueIndentScriptAndStyle: false,
    //在 windows 操作系统中换行符通常是回车 (CR) 加换行分隔符 (LF)，也就是回车换行(CRLF)，
    //然而在 Linux 和 Unix 中只使用简单的换行分隔符 (LF)。
    //对应的控制字符为 "\n" (LF) 和 "\r\n"(CRLF)。auto意为保持现有的行尾
    // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
    endOfLine: 'auto'
};  