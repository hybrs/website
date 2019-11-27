var path = "data/torr.txt", loaded_data = {},
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

    //loaded_data[$("#speed")[0].value] = torrents;

    /*$( "#speed" ).selectmenu({
        select: function( event, ui ) {
            console.log(ui.item.value)
            if( !loaded_data[ui.item.value])
                loaded_data[ui.item.value] = JSON.parse(readTextFile(path+ui.item.value)).torrents;
            $( "#tags" ).autocomplete({
                source: loaded_data[ui.item.value]
            });
        }
      });
*/

    //console.log(torrents);
    $( "#tags" ).autocomplete({
        source: torrents,
        minLength: 4,
        select: function (event, ui){
            var ul = document.getElementById("myl"), tb = document.getElementById("tbb") ;
            var li = document.createElement("li"), tr = document.createElement("tr")
                td = document.createElement("td");;
            //console.log(ui.item);
           
            let str = tab+"<td class=\"tel\"><a href=\"magnet:xt:urn:btih:"+ui.item.id+"\">magnet</a></td><td class=\"ter\">"+ui.item.value+"</td>",
                str1 = "<a href=\"magnet:?xt=urn:btih:"+ui.item.id+"\">magnet</a> "+ui.item.value;
            li.innerHTML = str1;
            ul.appendChild(li);
            setTimeout(function(){$("#tags")[0].value = "";}, 50)
        }
      });
    $("li").on("click", () => console.log("click"))
    $("body").on("click", function(){$("#tags")[0].value = "";})
	function printt(item){
		console.log(item)

	}
/*
	$('#autocomplete').click(function (e){this.value=""});

    $('#autocomplete').autocomplete({
        source: function(request, response) {
          
            let terms = request.term.toLowerCase().split(' '),
                matchers = []
            
            terms.map(function (el){matchers.push(new RegExp($.ui.autocomplete.escapeRegex(el), "i"))})
  
          let resultset = [];
          $.each(torrents, function() {
            let t = this.value;
            if (this.value && (!request.term || str_match(matchers, t)))
               resultset.push(this)

          });
            $('#badge').html(resultset.length)
            resultset = resultset.length > 200 ? resultset.slice(0,200) : resultset;
            
            //$('#area-paper-badge').html(resultset.length)
         response(resultset);

        },
        minLength : 5,
        response: function( event, ui ) {
//            console.log("ui.content");
//            console.log(ui.content);
            ui.content.sort(function (a, b) {
                return b.score-a.score;});
//            console.log("ui.content sort");
//
        },
        select: function (event, ui) {
        	printt(ui.item)
            setTimeout(function(){$('#autocomplete')[0].value = ""}, 200)
            $('#badge').html("")
        }
      })
    
    $('#autocomplete')
    	.on("focus", function(){$('#area-paper-badge').html("")})
	  	.on("input", function(key){
	        if(this.value.length < 5) 
	            $(".badge").html("")
	    })
*/
});