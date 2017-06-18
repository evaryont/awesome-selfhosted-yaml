<!doctype html>
<html>
    <head>
    </head>
    <html>
        <body>
            <input id="filter-name"/>
            <span id="lol-loading" style="display: none;">Loading</span>
            <table>
                <thead>
                    <tr>
                        <th id="sort-by-name">Name</th>
                        <th id="sort-by-desc">Description</th>
                    </tr>
                </thead>
                <tbody id="fill-me">
                </tbody>
            </table>
        </body>
        <script>
        /*shittily sort a shitty list with shitty js
          Copyright (C) 2017 nezkip
        */
            function gen_str(len)
            {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for( var i=0; i < len; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            }

            var data = Array.apply(null, Array(10000)).map(function(item) {
                return {
                    name: gen_str((Math.random() * 9) + 1),
                    desc: gen_str((Math.random() * 40) + 1)
                };
            });
            var workingSet = data;

            var filter = document.getElementById('filter-name');
            var loading = document.getElementById('lol-loading');
            var currentSortFunction = sortName;
            var currentFilterFunction = filterName;

            function gen_table(dataSource) {
                // Get a table handle, empty it.
                var table = document.getElementById('fill-me');
                var emptyNode = table.cloneNode(false);

                var fragment = document.createDocumentFragment();
                dataSource.forEach(function(elem) {
                    var row = document.createElement('tr');
                    var name = document.createElement('td');
                    name.textContent = elem.name
                    var desc = document.createElement('td');
                    desc.textContent = elem.desc;

                    row.appendChild(name);
                    row.appendChild(desc);
                    
                    fragment.appendChild(row);
                });

                table.parentNode.replaceChild(emptyNode, table);
                emptyNode.appendChild(fragment);
            }
            sort_and_rerender_table(currentSortFunction);

            function sort_and_rerender_table(sort_fn) {
                var filterText = filter.value;
                loading.style.display = 'inline-block';
                
                // Delay a bit to ensure the loading thing shows up
                setTimeout(function() {
                    var sorted = data.filter(function(item) {return currentFilterFunction(item, filterText)});
                    workingSet = sorted;
                    sorted = sorted.sort(sort_fn);
                    gen_table(sorted);

                    loading.style.display = 'none';
                }, 50)
            }

            function sortDesc(a, b) {
                if (a.desc > b.desc) { return 1; }
                if (a.desc < b.desc) { return -1; }
                return 0;
            }

            function sortName(a, b) {
                if (a.name > b.name) { return 1; }
                if (a.name < b.name) { return -1; }
                return 0;
            }

            function filterName(item, filter) {
                return item.name.startsWith(filter)
            }

            document.getElementById('sort-by-name').onclick = function() {
                currentSortFunction = sortName;
                sort_and_rerender_table(currentSortFunction);
            }

            document.getElementById('sort-by-desc').onclick = function() {
                currentSortFunction = sortDesc;
                sort_and_rerender_table(currentSortFunction);
            }

            document.getElementById('filter-name').onkeyup = function() {
                sort_and_rerender_table(currentSortFunction);
            }
        </script>
    </html>
</html>