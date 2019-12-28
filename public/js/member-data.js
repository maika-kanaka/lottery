// libraries electron and nodejs
const ipcRenderer = require("electron").ipcRenderer;
const models = require("../../models/");
const fs = require("fs");

// libraries 3rd party
const $ = require("jquery");
const moment = require("moment");
require("datatables.net")();
require("datatables.net-bs4")();
require("bootstrap");

// obj obj
var tableDataObj = $("#table-data");
var dataTableObj;

/*
 * INIT - INIT
 */

moment.locale("id");

$('.dropdown-toggle').dropdown();

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
                val.dataValues.photo !== null
                    ? "<img src='../../public/imgs/members/" +
                      val.dataValues.photo +
                      "'>"
                    : "",
                val.dataValues.fullname,
                val.dataValues.notes !== null ? val.dataValues.notes : "",
                val.dataValues.joined_at !== null
                    ? moment(val.dataValues.joined_at).format("DD MMMM YYYY")
                    : "",
                val.dataValues.won_at !== null
                    ? moment(val.dataValues.won_at).format("DD MMMM YYYY")
                    : "",
                `
                    <div class='dropdown dropleft'> 
                        <button class='btn btn-secondary btn-sm dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                            <i class='fa fa-list'></i>
                        </button>
                        
                        <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                            <a class='dropdown-item' onclick='getMemberDetail()'>
                                <i class='fa fa-eye'></i> Detail
                            </a>
                            <a class='dropdown-item' onclick='editMember()'>
                                <i class='fa fa-edit'></i>
                                Ubah
                            </a>
                            <a class='dropdown-item' onclick='deleteMember(`+ val.dataValues.id +`)'>
                                <i class='fa fa-close'></i>
                                Hapus
                            </a>
                        </div>
                    </div>
                `
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

function deleteMember(id)
{
    ipcRenderer.send('module-member', {
        action: 'open-confirm-delete-dialog',
        member_id: id
    });
}

ipcRenderer.on('reply-confirm-delete-dialog', (event, args) => 
{
    // when clicked yes
    if(args.buttonIdClick == 0)
    {   
        models.member.destroy({
            where: {
                id: args.member_id
            }
        }).then(() => {
            // show message success
            $("#msg-success-delete").show('slow');

            setTimeout(function(){
                $("#msg-success-delete").hide('slow');
            }, 2000);

            // refresh data
            getMemberData('refresh');
        });
    }
});