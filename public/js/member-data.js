// libraries electron and nodejs
const ipcRenderer = require("electron").ipcRenderer;
const models = require("../../models/");
const fs = require("fs");

// libraries 3rd party
const $ = require("jquery");
const moment = require("moment");
require("datatables.net")();
require("datatables.net-bs4")();

// obj obj
var tableDataObj = $("#table-data");
var dataTableObj;

/*
 * INIT - INIT
 */

moment.locale("id");

getMemberData("init");

$("#btn-refresh").click(function(e) {
    getMemberData("refresh");
    e.preventDefault();
});

$("#btn-registration").click(function(e) {
    ipcRenderer.send("module-registration", "window-open");
    e.preventDefault();
});

/*
 * DEF FUNCTIONS
 */

function getMemberData(evt) {
    models.member.findAll().then(function(res) {
        let members_data = [];
        var idx = 1;
        res.forEach(function(val, key) {
            members_data.push([
                idx,
                val.dataValues.photo !== null ? "<img src='../../public/imgs/members/" + val.dataValues.photo + "'>" : "",
                val.dataValues.fullname,
                val.dataValues.notes !== null ? val.dataValues.notes : "",
                val.dataValues.joined_at !== null
                    ? moment(val.dataValues.joined_at).format("DD MMMM YYYY")
                    : "",
                val.dataValues.won_at !== null
                    ? moment(val.dataValues.won_at).format("DD MMMM YYYY")
                    : ""
            ]);

            idx++;
        });

        if (evt == "refresh") {
            dataTableObj.clear();
            dataTableObj.rows.add(members_data);
            dataTableObj.draw();
        } else {
            dataTableObj = tableDataObj.DataTable({
                data: members_data
            });
        }
    });
}
