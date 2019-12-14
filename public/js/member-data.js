// libraries electron and nodejs
const models = require("../../models/");

// libraries 3rd party
const $ = require("jquery");
const moment = require("moment");

// obj obj 
let tableDataObj = $("#table-data");

/*
* INIT - INIT
*/
models.member.findAll().then(function(res)
{
    let html_data = '';

    var idx = 1;
    res.forEach(function(val, key)
    {
        html_data += '<tr>';
        html_data += '<td> '+ idx +' </td>';
        html_data += '<td> '+ val.dataValues.photo +' </td>';
        html_data += '<td> '+ val.dataValues.fullname +' </td>';

        let notes = (val.dataValues.notes !== null) ? val.dataValues.notes : '';
        html_data += '<td> '+ notes +' </td>';

        let joined_at;
        if(val.dataValues.joined_at !== null){
            joined_at = moment(val.dataValues.joined_at).format('DD MMMM YYYY');
        }else{
            joined_at = '';
        }
        html_data += '<td> '+ joined_at +' </td>';

        let won_at;
        if(val.dataValues.won_at !== null){
            won_at = moment(val.dataValues.won_at).format('DD MMMM YYYY');
        }else{
            won_at = '';
        }
        html_data += '<td> '+ won_at +' </td>';
        html_data += '</tr>';

        idx++;
    });

    tableDataObj.find("tbody").html(html_data);
});