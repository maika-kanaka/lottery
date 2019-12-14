// libraries electron and nodejs
const { ipcRenderer } = require("electron")
const Sequelize = require("sequelize")
const models = require("../../models/")
const fs = require("fs")
const path = require('path')

// libraries 3rd party
const $ = require("jquery")
const AllHtmlEntities = require('html-entities').AllHtmlEntities;
require("tooltipster")

// obj input 
const NO_IMAGE_URL = '../../public/imgs/no-image.jpeg';
let fullnameObj = $("#fullname");
let notesObj = $("#notes");
let joinedAtObj = $("#joined_at");
let photoObj = $('#photo-preview');

/* 
* INIT 
*/

$('.tooltip-custom').tooltipster({
    animation: 'fade',
    trigger: 'custom'
});

photoObj.attr('src', NO_IMAGE_URL);

/* 
* EVENT - EVENT 
*/

$("#btn-close").click(function(e)
{
    ipcRenderer.send("module-registration", "window-close")
    e.preventDefault()
}) 

$("#btn-upload").click(function()
{
    ipcRenderer.send('module-registration', 'open-upload-dialog');
});

$("#btn-save").click(function()
{
    // get input 
    let fullname = AllHtmlEntities.encode(fullnameObj.val().trim());
    let notes = AllHtmlEntities.encode(notesObj.val().trim());
    let joined_at = joinedAtObj.val();

    // valid: form 
    let is_valid_form = true;

    if(joined_at == ''){
        joinedAtObj.closest(".tooltip-custom").tooltipster('content', 'Tanggal bergabung harus diisi');
        joinedAtObj.closest(".tooltip-custom").tooltipster('show');
        is_valid_form = false;
    }
    
    if(fullname == ''){
        fullnameObj.closest(".tooltip-custom").tooltipster('content', 'Nama lengkap harus diisi');
        fullnameObj.closest(".tooltip-custom").tooltipster('show');
        is_valid_form = false;
    }else if(fullname.length > 255){
        fullnameObj.closest(".tooltip-custom").tooltipster('content', 'Maksimal 255 karakter');
        fullnameObj.closest(".tooltip-custom").tooltipster('show');
        is_valid_form = false;
    }

    if(is_valid_form === false)
    {
        setTimeout(function(){
            fullnameObj.closest(".tooltip-custom").tooltipster('hide');
            notesObj.closest(".tooltip-custom").tooltipster('hide');
            joinedAtObj.closest(".tooltip-custom").tooltipster('hide');
        }, 2000);
        return false;
    }

    // save
    models.member.create({
        fullname: fullname,
        notes: notes,
        joined_at: joined_at
    }).then(function(mem){
        
        // upload 
        let filename = mem.dataValues.id + path.extname(photoObj.attr('data-path-url'));

        fs.copyFile(photoObj.attr('data-path-url'), __dirname + '\\..\\..\\public\\imgs\\members\\' + filename, function(err){
            console.log('error gan: '+ err)
        })

        // update database dengan photo nama 
        models.member.update({
            photo: filename
        }, {
            where: {id: mem.dataValues.id}
        }).then(function()
        {
            // clear the form 
            fullnameObj.val('');
            notesObj.val('');
            joinedAtObj.val('');
            photoObj.attr('src', NO_IMAGE_URL);
            photoObj.attr('data-path-url', '');

            // message success
            $("#msg-success-save").css({'display': 'block'});

            setTimeout(function()
            {
                $("#msg-success-save").css({'display': 'none'});
            }, 2000);
        })

    })

    // focus
    joinedAtObj.focus();
})

ipcRenderer.on('upload-fullpath', (event, fullpath) => 
{
    let ext_file = path.extname(fullpath[0]).replace('.', '');

    fs.readFile(fullpath[0], function(err, data)
    {
        var base64Image = new Buffer(data, 'binary').toString('base64');
        $("#photo-preview").attr('src', 'data:image/'+ ext_file +';base64, ' + base64Image);
        $("#photo-preview").attr('data-path-url', fullpath[0]);
    })
})