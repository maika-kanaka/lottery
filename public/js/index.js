
// libraries 3rd party

const { ipcRenderer } = require("electron")
const $ = require("jquery")

/* 
* EVENT - EVENT 
*/

$("#module-registration").click(function(e)
{
    ipcRenderer.send("module-registration", "window-open")
    e.preventDefault()
})

$("#module-member").click(function(e)
{
    ipcRenderer.send("module-member", "window-open")
    e.preventDefault()
})