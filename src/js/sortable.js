var indexBefore = -1;

function getIndex(itm, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (itm[0] === list[i]) break;
    }
    return i >= list.length ? -1 : i;
}


// The one i want for sortable.

$('#sortable').sortable({
    start: function(event, ui) {
        indexBefore = getIndex(ui.item, $('#sortable li'));
    },
    change: function(event, ui) {
        var indexAfter = getIndex(ui.item,$("#sortable li")); 
    },
   stop: function(event, ui) {
       var indexAfter = getIndex(ui.item,$("#sortable li")); 
       if (indexBefore==indexAfter) return;
       if (indexBefore<indexAfter) {
           $($("#list li")[indexBefore]).insertAfter(
               $($("#list li")[indexAfter]));
       }
       else {
           $($("#list li")[indexBefore]).insertBefore(
               $($("#list li")[indexAfter]));
       }
   }
});

 $('#graph').sortable({
    start: function(event, ui) {
        indexBefore = getIndex(ui.item, $('#graph'));
    },
    change: function(event, ui) {
        var indexAfter = getIndex(ui.item,$("#graph")); 
    },
   stop: function(event, ui) {
       var indexAfter = getIndex(ui.item,$("#graph")); 
       if (indexBefore==indexAfter) return;
       if (indexBefore<indexAfter) {
           $($("#sortable li")[indexBefore]).insertAfter(
               $($("#sortable li")[indexAfter]));
       }
       else {
           $($("#sortable li")[indexBefore]).insertBefore(
               $($("#sortable li")[indexAfter]));
       }
   }
});