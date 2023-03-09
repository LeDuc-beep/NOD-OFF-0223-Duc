function ajaxChangeStatus(link,type) {
    $.get(link, function (data){
        if(data !== "") {
            alertify.success('Change status success');
        }
    }, "json")
}

function ajaxChangeOrdering(link,id,value) {
    $.get(link,function (data) {
        console.log(data);
        if(data !== "") {
            const {_id, ordering} = data;
            const parent = `#order-${_id}`;
            const child = `<input class="text-center ordering" name="ordering" type="number" id="${id}" value="${value}">`;
            $(parent).html(child);
            alertify.success('Change ordering success');
        }
    }, "json" )
}

