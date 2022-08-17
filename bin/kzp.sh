 #! /bin/sh

#change dir
cd ~/projects/kolkozaprevoz/src

echo "crawl"
python3 scrape.py

#back to root
cd ..

#commit
git add .
git commit -m "update prices"
git push
