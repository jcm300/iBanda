$(() => {
    document.getElementById("approved").checked=false
    document.getElementById("notApproved").checked=false
    $('#input').val('')

    $('#approved').click(e => {
        document.getElementById("notApproved").checked=false
        filter()
    })

    $('#notApproved').click(e => {
        document.getElementById("approved").checked=false
        filter()
    })
})

function filter() {
    var input, filter, table, tr, td, tdA, a;
    
    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    
    for (var i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        a = td.getElementsByTagName("a")[0]; 
        tdA = tr[i].getElementsByTagName("td")[3];

        if (td) {
            txtValue = a.textContent || a.innerText;
            txtValueA = tdA.textContent || tdA.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                if(document.getElementById("approved").checked){
                    if(txtValueA=="yes") tr[i].style.display = ""; 
                    else tr[i].style.display = "none";
                }else{
                    if(document.getElementById("notApproved").checked){
                        if(txtValueA=="no") tr[i].style.display = "";
                        else tr[i].style.display = "none";
                    }else tr[i].style.display = "";
                }
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}