    document.addEventListener('DOMContentLoaded', function () {
      const tabs = document.querySelectorAll('.tab');
      const tabContents = document.querySelectorAll('.tab-content');
      tabs.forEach(tab => {
        tab.addEventListener('click', function () {
          tabs.forEach(t => t.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          this.classList.add('active');
          document.getElementById(this.dataset.tab + '-tab').classList.add('active');
        });
      });

      const proxy = 'https://api.allorigins.win/raw?url=';
      const gelbooruExtractBtn = document.getElementById('gelbooru-extract-btn');
      const danbooruExtractBtn = document.getElementById('danbooru-extract-btn');
      const resultDiv = document.getElementById('result');
      const statusDiv = document.getElementById('status');
      const copyBtn = document.getElementById('copy-btn');
      const copyMessage = document.getElementById('copy-message');

      function decodeEntities(input) {
        const doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
      }

      gelbooruExtractBtn.addEventListener('click', async () => {
        const url = document.getElementById('gelbooru-url-input').value.trim();
        resultDiv.textContent = '';
        statusDiv.textContent = 'Extracting from Gelbooru...';

        try {
          const res = await fetch(proxy + encodeURIComponent(url));
          const text = await res.text();
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const title = doc.querySelector('title')?.textContent || '';
          const cleaned = decodeEntities(title.replace(/\s*-\s*Image View\s*-\s*\|\s*Gelbooru.*$/i, '').trim());
          resultDiv.textContent = cleaned;
          statusDiv.textContent = 'Tags extracted from Gelbooru.';
        } catch (err) {
          statusDiv.textContent = 'Failed to fetch Gelbooru content.';
        }
      });

      danbooruExtractBtn.addEventListener('click', async () => {
        const url = document.getElementById('danbooru-url-input').value.trim();
        resultDiv.textContent = '';
        statusDiv.textContent = 'Extracting from Danbooru...';

        try {
          const res = await fetch(proxy + encodeURIComponent(url));
          const text = await res.text();
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const tags = [...doc.querySelectorAll('[data-tag-name]')]
            .map(e => e.getAttribute('data-tag-name').replace(/_/g, ' '))
            .filter(Boolean);
          resultDiv.textContent = tags.join(', ');
          statusDiv.textContent = 'Tags extracted from Danbooru.';
        } catch (err) {
          statusDiv.textContent = 'Failed to fetch Danbooru content.';
        }
      });

      copyBtn.addEventListener('click', () => {
        const text = resultDiv.textContent;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          copyMessage.classList.add('show');
          setTimeout(() => copyMessage.classList.remove('show'), 2000);
        });
      });
    });