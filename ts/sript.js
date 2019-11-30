var tntpath = "data/tnt.txt", start = true, ntntpath = "data/notnt0.txt", ntntpath1 = "data/notnt1.txt", loaded_data = [],
    tab = "<table class=\"tb\"><tr>",
    tabend = "</tr></table>", itt = [],
    magnetico = "<i class=\"fa fa-magnet\" style=\"font-size:15px;color:red;\"></i>";

function str_match(matchers, t){
    let res = true;
    for(let i = 0; i < matchers.length; i++)
        res = res && matchers[i].test(t)
    return res;
}

function print_query(){
  let cat = "", text = "<hr><h3>"+itt.length+" torrent trovati:</h3>", i = 0;

  $("#queryresult")[0].innerHTML = "";
  if ($("#tags")[0].value != ""){

  for(i = 0; i < itt.length;i++){
    let item = itt[i]; 
    if(item.cat != cat){
      cat = item.cat;
      if(i > 0) text+="</table><hr>";
      text += "<h4>"+item.cat+"</h4><table class=\"restab\">";
    }
    let stt = "";
    if( loaded_data.indexOf(item.id) >= 0)
      stt= "\"font-weight: bold; font-style: italic; color:blue;\""

    text += "<tr id = \""+item.id+"\" class =\"res\"><td class=\"tdtile\" style="+stt+" >"+item.value+" "+(item.descr ?  item.descr : "") +"</td><td class=\"tddim\">"+item.dim+"</td><td style = \"color:green\" class=\"tdseed\">"+(item.seed > 0 ? item.seed : "?")+"</td><td style = \"color:red\" class=\"tdleech\">"+(item.leech > 0 ? item.leech : "?")+"<td class=\"tdmagnet\"><a href=\"magnet:?xt=urn:btih:"+item.id+"\">"+magnetico+"</a></td></tr>";
  }
  text+"</table>";
  $("#queryresult")[0].innerHTML = text;
  $(".res").on("click", function(){
    if( !(loaded_data.indexOf(this.id) >= 0)){
      loaded_data.push(this.id)
      $("#tbb")[0].innerHTML += $(this)[0].innerHTML;
      $(this.childNodes[0]).css("font-weight", "bold")
      $(this.childNodes[0]).css("font-style", "italic")
      $(this.childNodes[0]).css("color", "blue")
    }})
}
  
 
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

  $( "#speed" ).selectmenu({
    disabled: true
  });

    var torrents = [JSON.parse(readTextFile(tntpath)).torrents,JSON.parse(readTextFile(ntntpath)).torrents];//JSON.parse(readTextFile(path)).torrents;
    
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
      _create: function() {
        this._super();
        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
      },
      _renderMenu: function( ul, items ) {
        var that = this,
          currentCategory = "";
          itt = items;
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
            let str1 =/* "<a href=\"magnet:?xt=urn:btih:"+item.id+"\">"+*/item.value + "  || "+item.dim+" MB"//</a>";

            if ((loaded_data.indexOf(item.id) > -1))
                return $( "<li>" )
                .append( "<div style = \"font-size:0.8em; font-weight: bold; font-style: italic; color:blue;\">"+str1+"</div>" )
                .appendTo( ul );
            else
                return $( "<li>" )
                .append("<div style = \"font-size:0.8em;\">"+str1+"</div>" )
                .appendTo( ul );
         } 
      });

    //console.log(torrents);
    $( "#tags" ).catcomplete({
        source: torrents[0],
        minLength: 3,
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
           
            let str ="<tr><td class=\"tdtile\">"+ui.item.value+" "+(ui.item.descr ?  ui.item.descr : "") +"</td><td class=\"tddim\">"+ui.item.dim+"</td><td class=\"tdseed\">"+(parseInt(ui.item.seed)  > 0 ? ui.item.seed : "?")+"</td><td class=\"tdleech\">"+(parseInt(ui.item.leech) > 0 ? ui.item.leech : "?")+"<td class=\"tdmagnet\"><a href=\"magnet:?xt=urn:btih:"+ui.item.id+"\">"+magnetico+"</a></td></tr>";
                str1 = "<a href=\"magnet:?xt=urn:btih:"+ui.item.id+"\">magnet</a> "+ui.item.value + " "+ui.item.dim+" MB";
            if( !(loaded_data.indexOf(ui.item.id) >= 0)){
            loaded_data.push(ui.item.id)    
            //li.innerHTML = str1;
            //ul.appendChild(li);
            $("#tbb")[0].innerHTML += str;
            setTimeout(function(){$("#tags")[0].value = "";}, 50)}
        }
        
      });

      $( "#speed" ).selectmenu({
        disabled: false,
        select: function (event, ui){

          if(start && ui.item.index > 0){
            start = false;
            $( "#speed" ).selectmenu({ disabled: true})
            $( "#tags" ).catcomplete({ disable: true})
            torrents[1] = torrents[1].concat(JSON.parse(readTextFile(ntntpath1)).torrents)
            $( "#speed" ).selectmenu({ disabled: false})
            $( "#tags" ).catcomplete({ disabled: false})
          }

          $( "#tags" ).catcomplete({
            source: ui.item.index < 2 ? torrents[ui.item.index] : torrents[0].concat(torrents[1])
        })}
      });
    
      $("#cerca").on("click", print_query)


    $("body").on("click", function(){$("#tags")[0].value = "";})
});