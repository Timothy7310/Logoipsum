let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs');

let asyncCss = `<script>
function loadStyle(url){
	let link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet';
	document.body.appendChild(link);
}
loadStyle('.dist/css/async.css');
</script>`;

app.use('/css', express.static(path.resolve(__dirname, './dist/css')));
app.use('/js', express.static(path.resolve(__dirname, './dist/js')));
app.use('/img', express.static(path.resolve(__dirname, './dist/img/**/*')));
app.use('favicon/favicon.ico', express.static(path.resolve(__dirname, './dist/favicon/favicon.ico')));

// let pages = ['index', 'gallery'];

app.use('*', function(req, res){
    let criticalCSS = fs.readFileSync('./dist/css/critical.css').toString('UTF-8');
	let html = fs.readFileSync('./dist/index.html').toString('UTF-8');
    html = html.replace('<link rel="stylesheet" href="css/style.min.css">', `<style>${criticalCSS}</style>`);
    html = html.replace('<!-- asyncCss -->', asyncCss);
    res.end(html);
});

console.log('server started')
app.listen(3000);