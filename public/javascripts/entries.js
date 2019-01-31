$(() => {
    $('#input').val('')
})

function filter() {
    var input, filter, table, tr, td, a;
    
    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    
    for (var i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        a = td.getElementsByTagName("a")[0]; 
        
        if (td) {
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}