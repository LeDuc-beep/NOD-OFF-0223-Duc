function ajaxChangeStatus(link,type) {
    $.get(link, function (data){
        if(data !== "") {
            let {_id, status} = data;
            status = (status === "active")?"inactive":"active";
            const parent = `#status-${_id}`;
            let link = `/admin/${type}/changeStatus/${_id}/${status}`;
            let className = (status === "active")?"rounded-circle btn btn-sm btn-success":"rounded-circle btn btn-sm btn-danger";
            let tagName   = (status === "active")?"activeBtn":"inactiveBtn";
            let name  = (status === "active")?`<i class="fas fa-check">`:`<i class="fas fa-ban">`;
            const child = `<a href="javascript:ajaxChangeStatus('${link}','${type}')" class="${className}" name="${tagName}">${name}</a>`;
            $(parent).html(child);
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

