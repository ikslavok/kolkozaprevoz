from parsel import Selector
import requests
import json
r = requests.get('https://www.cargopedia.net/europe-fuel-prices').text
s = Selector(text=r)

benzin = s.xpath('//table/tbody/tr[34]/td[2]/text()').get()
dizel = s.xpath('//table/tbody/tr[34]/td[3]/text()').get()

cene = {}
cene['benzin'] = benzin
cene['dizel'] = dizel

f = open('cene.json', 'w')
f.write(json.dumps(cene))
f.close()