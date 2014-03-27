var casper = require('casper').create();
//var casper = require('casper').create({verbose:true, logLevel: "debug"});
var exec = require('child_process').execFile;
var fs = require('fs');

// use this as test drive
var test_links = [
    'google.com',
    'facebook.com'
];

// read links from file
var links = fs.read('links.txt').split('\n');

casper.start();

casper.each(links, function(casper, link) {
    this.thenOpen('http://rulespace.com/swg-ratertool/tool.php', function() {
      if (fs.exists('freecap.png')) fs.remove('freecap.png');
      this.captureSelector('freecap.png', '#freecap');
    });

    casper.waitFor(function() {
      return fs.exists('freecap.png');
    });

    var resolved_captcha = null;

    casper.then(function() {
      var ocr = exec('tesseract', ['freecap.png', 'stdout'], null, function(err, stdout, stderr) {
        resolved_captcha = stdout.trim();
        //console.log('tesseract: ', resolved_captcha);
      });
    });

    casper.waitFor(function() {
      return resolved_captcha !== null;
    });

    casper.then(function() {
      //this.echo('word ' + resolved_captcha);
      this.fill('form', {
        'u' : link,
        'word' : resolved_captcha
      }, true);
    });

    casper.then(function() {
      //this.echo(this.getPageContent());
      var res = this.evaluate(function() {
        return JSON.stringify({ 
            page: __utils__.getElementByXPath('/html/body/div[2]/center/table/tbody/tr[2]/td').innerHTML,
            category: __utils__.getElementByXPath('/html/body/div[2]/center/table/tbody/tr[2]/td[3]/tt').innerHTML
        });
      });
      if (res===null) 
          this.echo("failed: "+link)
      else
          this.echo(res);
    });
});

casper.run();
