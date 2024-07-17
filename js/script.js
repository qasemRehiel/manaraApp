// set up
const toDay = new Date().getFullYear()+'-'+(new Date().getMonth() + 1).toString().padStart(2,'0')+'-'+new Date().getDate().toString().padStart(2,'0');
var report_day = toDay;
var stored_data = localStorage['manara_Data'];
var students = {};
if(!stored_data || stored_data == '{}'){
    $('#page').html('<div style="margin-top: 100px;margin-bottom: 30px; font-size: 30px; color: #aaa">ما من طلبة</div><a href="add_page.html"><button class="btn2 add_page">إضافة طالب جديد</button></a>');
}else{
    students = JSON.parse(stored_data);

    //===== sort data===========
    show_student_list();
}

// swer list
var swer_list = '';
for (let x = 114; x >= 0; x--) {
    const element = swer[x];
    swer_list += '<option value="'+x+'">'+element+'</option>';
}
$('.swer_list').html(swer_list);
//================


//==========================

function show_student_list(search_text){
    if(document.getElementById('order')){
        //
    }
    if(document.getElementById('page')){
        document.getElementById('page').innerHTML = '';
        for (let x = 0; x < Object.keys(students).length; x++) {
            if(!search_text || Object.keys(students)[x].search(search_text) >= 0){
                const element = Object.keys(students)[x];
                document.getElementById('page').innerHTML += '<a href="student_details_page.html?name='+element.replaceAll(' ','_')+'"><div class="student_bar"><span style="width:30px; display: inline-block">'+(x+1)+'</span>'+element+'</div></a>';
            }
        }
        document.getElementById('page').innerHTML += '<div style="height: 50px"></div><a href="add_page.html"><button class="btn2 add_page">إضافة طالب جديد</button></a>';
        document.getElementById('page').innerHTML += '<a href="add_page.html"><button class="btn2 add_page gray_background">عرض كل الطلبة</button></a>';
    }else if(document.getElementById('check_page')){
        document.getElementById('check_page').innerHTML = '';
        for (let x = 0; x < Object.keys(students).length; x++) {
            if(!search_text || Object.keys(students)[x].search(search_text) >= 0){
                const element = Object.keys(students)[x];
                var sign = '<img src="img/'+get_check_value(x)+'.svg" class="check_icons" id="'+x+'">';
                document.getElementById('check_page').innerHTML += '<tr><td style="width:30px">'+(x+1)+'</td><td>'+sign+'</td><td class="student_bar">'+element+'</td></tr>';
            }
        }
        $('.check_icons').click(function(){
            var v = get_check_value(this.id);
            var next_value = {
                A: 'B', B: 'C', C: 'A',undefined: 'B'
            }
            students[Object.keys(students)[this.id]].checks = students[Object.keys(students)[this.id]].checks.replace(v+':'+report_day+';',next_value[v]+':'+report_day+';');
            this.src = 'img/'+(next_value[v])+'.svg';
            if(v == undefined){
                students[Object.keys(students)[this.id]].checks += 'B:'+report_day+';';
                this.src = 'img/B.svg';
            }
            localStorage['manara_Data'] = JSON.stringify(students);
        })
    }
}


function update_online(){
    Object.keys(students).forEach(n => {
        database.ref(my_manara+'/students/'+n).set(students[n]).then(() => {
            console.log('OK')
        }).catch((err) => {
            console.log(err)
        });
    })
};
update_online()


function get_check_value(i) {
    var checks = students[Object.keys(students)[i]].checks;
    if(String(checks).search(':'+report_day+';')){
        var value = checks[String(checks).search(':'+report_day+';') - 1];
    };
    return value;
}

function sort_by_swer() {
    let sortedData = {};

    // Sort the keys based on the "swer1" property
    let keys = Object.keys(students).sort((a, b) => {
    if (Number(students[a].swer1) < Number(students[b].swer1)) return -1;
    if (Number(students[a].swer1) > Number(students[b].swer1)) return 1;
    return 0;
    });

    // Populate the new object with the sorted keys
    for (let key of keys) {
    sortedData[key] = students[key];
    }
    students = sortedData;
    show_student_list()
}


