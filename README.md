swg_site_rater
==============

Download site ratings for links from Symantec web gateway's rulespace.com. If you need to collect site categories for a list of sites you have to use rulespace.com. Unfortunately this site is captcha proteced. Fortunately it uses a very simple one, so the standard tessarat OCR software can parse most of them. 

Requirements
------------
- phantomjs 
- casperjs for driving phantomjs
- tessarat for parsing captcha images

Usage
-----
1. Edit the javascript file 
* Either change test_link list and assign to link
* or create a file named links.txt containing one link at a line.
2. Run the script with casperjs swg_site_rater.js
It will write to the stdout the result.
If tessarat fails to render the captcha the script writes failed:<link>.
For those links you have to restart the script again (maybe with an edited links.txt file.

So the full command cycle is something like this.

> vi links.txt
> echo > result.txt
cycle starts
> casperjs swg_site_rater.js | tee output
> grep failed output > links.txt
> vi links.txt //in the file issue command :%s/failed: //g
> grep -v failed output >> result.txt
goto to cycle starts if links.txt is not empty
> sort result.txt

