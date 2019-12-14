const { ipcRenderer } = require("electron")
const $ = require("jquery")

$("#module-registration").click(function(e)
{
    ipcRenderer.send("module-registration", "window-open")
    e.preventDefault()
})