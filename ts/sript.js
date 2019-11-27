var path = "data/torr.txt", loaded_data = [],
    tab = "<table class=\"tb\"><tr>",
    tabend = "</tr></table>";

function str_match(matchers, t){
    let res = true;
    for(let i = 0; i < matchers.length; i++)
        res = res && matchers[i].test(t)
    return res;
}

function readTextFile(file){
     let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                return rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return rawFile.responseText;
}

$(function(){
    let torrents = JSON.parse(readTextFile(path)).torrents;
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
      _create: function() {
        this._super();
        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
      },
      _renderMenu: function( ul, items ) {
        var that = this,
          currentCategory = "";
        $.each( items, function( index, item ) {
          var li;
          if ( item.cat != currentCategory ) {
            ul.append( "<li class='ui-autocomplete-category'>" + item.cat + "</li>" );
            currentCategory = item.cat;
          }
          li = that._renderItemData( ul, item );
          if ( item.cat ) {
            li.attr( "aria-label", item.cat + " : " + item.label );
          }
        })
    },
        _renderItem: function( ul, item ) {
            let str1 = "<a href=\"magnet:?xt=urn:btih:"+item.id+"\">"+item.value + "  || "+item.dim+" MB</a>";

            if ((loaded_data.indexOf(item.id) > -1))
                return $( "<li>" )
                .append( "<div style = \"font-size:0.8em; font-weight: bold; font-style: italic; color:blue;\">"+str1+"</div>" )
                .appendTo( ul );
            else
                return $( "<li>" )
                .append( "<div style = \"font-size:0.8em;\">"+str1+"</div>" )
                .appendTo( ul );
         } 
      });

    //console.log(torrents);
    $( "#tags" ).catcomplete({
        source: torrents,
        minLength: 4,
        response: function( event, ui ) {
            ui.content.sort(function (a, b) {
                let ress = a.cat.localeCompare(b.cat); 
                if (ress == 0) return a.value.localeCompare(b.value); 
                return ress;/*a.year <= b.year*/;});
            },
        select: function (event, ui){
            var ul = document.getElementById("myl");
            var li = document.createElement("li");
            //console.log(ui.item);
           
            let str = tab+"<td class=\"tel\"><a href=\"magnet:xt:urn:btih:"+ui.item.id+"\">magnet</a></td><td class=\"ter\">"+ui.item.value+"</td>",
                str1 = "<a href=\"magnet:?xt=urn:btih:"+ui.item.id+"\">magnet</a> "+ui.item.value + " "+ui.item.dim+" MB";
            if( !(ui.item.id in loaded_data)){
            loaded_data.push(ui.item.id)    
            li.innerHTML = str1;
            ul.appendChild(li);
            setTimeout(function(){$("#tags")[0].value = "";}, 50)}
        }
        
      });
    $("li").on("click", () => console.log("click"))
    $("body").on("click", function(){$("#tags")[0].value = "";})
	function printt(item){
		console.log(item)

	}
});