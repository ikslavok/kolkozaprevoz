<svelte:head>
	<title>Privacy Policy — Trip Cost</title>
	<meta name="description" content="Privacy policy for the Trip Cost app and tripcost.filipilic.com" />
</svelte:head>

<article>
	<h2>Privacy Policy</h2>
	<p class="updated">Last updated: 9 August 2026</p>

	<p>
		This policy covers the website at <strong>tripcost.filipilic.com</strong> and the
		<strong>Trip Cost</strong> mobile app. Both are run by Filip Ilić. There is no account,
		no sign-up and no advertising in either.
	</p>

	<h3>What we do not collect</h3>
	<p>
		We do not collect your name, email, phone number, contacts, photos or device location.
		The app asks for no permissions beyond internet access.
	</p>

	<h3>What stays on your device</h3>
	<p>
		Your inputs — distance, consumption, number of passengers, chosen country, fuel type and
		currency — are kept on your own device (browser <code>localStorage</code> on the web, local
		storage in the app), together with the last fuel prices and exchange rates downloaded. They
		are never sent to us. Clearing site data or uninstalling the app removes them.
	</p>

	<h3>What reaches our server</h3>
	<ul>
		<li>
			<strong>Fuel prices and exchange rates.</strong> A plain request for the current figures.
			Nothing about you is attached.
		</li>
		<li>
			<strong>Place search and route lookup.</strong> If you type a starting point or destination,
			that text and the resulting stops are sent to our server, which forwards them to the Google
			Maps Platform (Places and Directions APIs) to return suggestions and a distance. We do not
			store these queries in a database; they exist in request logs and CDN caches for a short
			period and are not linked to an identity. Google processes them under its own
			<a href="https://policies.google.com/privacy" rel="noopener">privacy policy</a>.
		</li>
	</ul>
	<p>Our hosting provider, Vercel, processes the requests needed to serve the site.</p>

	<h3>Analytics</h3>
	<p>
		The website (not the app) uses a self-hosted <a href="https://umami.is" rel="noopener">Umami</a>
		instance to count page views. It sets no cookies and does not track you across other sites; it
		records aggregate figures such as page, referrer, country and device type.
	</p>

	<h3>Cookies</h3>
	<p>We set no cookies for tracking or advertising.</p>

	<h3>Children</h3>
	<p>The service is not directed at children under 13 and collects no data from them.</p>

	<h3>Your rights</h3>
	<p>
		Because we hold no account and no profile about you, there is normally nothing to export or
		delete on our side. If you believe we hold data relating to you, write to
		<a href="mailto:filipilicfilip@gmail.com">filipilicfilip@gmail.com</a> and we will respond.
	</p>

	<h3>Changes</h3>
	<p>If this policy changes, the date at the top changes with it.</p>

	<hr />

	<h2 lang="sr">Politika privatnosti</h2>
	<p class="updated" lang="sr">Poslednja izmena: 9. avgust 2026.</p>

	<div lang="sr">
		<p>
			Ova politika važi za sajt <strong>tripcost.filipilic.com</strong> i aplikaciju
			<strong>Trip Cost</strong>. Oba vodi Filip Ilić. Nema naloga, nema registracije i nema
			reklama.
		</p>

		<h3>Šta ne prikupljamo</h3>
		<p>
			Ne prikupljamo ime, imejl, broj telefona, kontakte, fotografije ni lokaciju uređaja.
			Aplikacija ne traži nijednu dozvolu osim pristupa internetu.
		</p>

		<h3>Šta ostaje na tvom uređaju</h3>
		<p>
			Ono što uneseš — kilometražu, potrošnju, broj putnika, državu, vrstu goriva i valutu — čuva
			se na tvom uređaju, zajedno sa poslednje preuzetim cenama goriva i kursevima. Nama se ne
			šalje. Brisanjem podataka sajta ili deinstalacijom aplikacije nestaje i to.
		</p>

		<h3>Šta stiže do našeg servera</h3>
		<ul>
			<li>
				<strong>Cene goriva i kursevi.</strong> Običan zahtev za trenutne vrednosti, bez ijednog
				podatka o tebi.
			</li>
			<li>
				<strong>Pretraga mesta i ruta.</strong> Ako upišeš polazište ili odredište, taj tekst i
				dobijene stanice šalju se našem serveru, koji ih prosleđuje Google Maps platformi
				(Places i Directions API) da bi vratio predloge i kilometražu. Te upite ne čuvamo u bazi;
				kratko postoje u logovima i CDN kešu i nisu povezani sa identitetom. Google ih obrađuje
				po svojoj <a href="https://policies.google.com/privacy" rel="noopener">politici privatnosti</a>.
			</li>
		</ul>
		<p>Vercel, naš hosting, obrađuje zahteve neophodne za posluživanje sajta.</p>

		<h3>Analitika</h3>
		<p>
			Sajt (ne i aplikacija) koristi samostalno hostovan <a href="https://umami.is" rel="noopener">Umami</a>
			za brojanje poseta. Ne postavlja kolačiće i ne prati te po drugim sajtovima; beleži zbirne
			podatke kao što su stranica, referer, država i tip uređaja.
		</p>

		<h3>Kolačići</h3>
		<p>Ne postavljamo kolačiće za praćenje ni za reklame.</p>

		<h3>Deca</h3>
		<p>Servis nije namenjen deci mlađoj od 13 godina i ne prikuplja njihove podatke.</p>

		<h3>Tvoja prava</h3>
		<p>
			Pošto ne držimo nalog ni profil o tebi, obično nema šta da se izveze ni obriše kod nas. Ako
			misliš da imamo podatke koji se odnose na tebe, piši na
			<a href="mailto:filipilicfilip@gmail.com">filipilicfilip@gmail.com</a> i odgovorićemo.
		</p>

		<h3>Izmene</h3>
		<p>Ako se politika promeni, menja se i datum na vrhu.</p>
	</div>
</article>

<style>
	article {
		max-width: 42em;
		margin: 0 auto 4em;
		line-height: 1.6;
	}
	h2 {
		margin-top: 1.5em;
	}
	h3 {
		margin-top: 1.8em;
	}
	.updated {
		color: #777;
		font-style: italic;
		margin-top: -0.5em;
	}
	hr {
		margin: 3em 0;
		border: 0;
		border-top: 1px solid #ddd;
	}
</style>
