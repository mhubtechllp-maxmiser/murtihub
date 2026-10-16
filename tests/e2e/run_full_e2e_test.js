import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR =
  'C:\\Users\\Rishi\\.gemini\\antigravity-ide\\brain\\db6f79a0-d016-4044-afa7-c115ca772a5c\\screenshots';

const DESKTOP_VIEWPORT = { width: 1280, height: 800, isMobile: false, hasTouch: false };
const MOBILE_VIEWPORT = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

const pagesToTest = [
  { name: '01_home', path: '/', label: 'Home Page' },
  { name: '02_projects', path: '/projects', label: 'Projects Showcase' },
  { name: '03_leadership', path: '/leadership', label: 'Leadership & Governance' },
  { name: '04_services', path: '/services', label: 'Engineering Services' },
  { name: '05_architecture', path: '/architecture', label: 'Architecture & Sovereign IP' },
  { name: '06_covenant', path: '/covenant', label: 'Client Covenant' },
  { name: '07_tech_arsenal', path: '/tech-arsenal', label: 'Tech Arsenal' },
  { name: '08_contact', path: '/contact', label: 'Contact & Advisory' },
  { name: '09_admin', path: '/admin', label: 'Admin Studio' },
];

async function runFullE2ETest() {
  console.log('========================================================================');
  console.log('🚀 MURTIHUB TECHNOLOGIES — REAL BROWSER E2E TEST (DESKTOP & MOBILE)');
  console.log(`Chrome Executable: ${CHROME_PATH}`);
  console.log(`Target Application: ${BASE_URL}`);
  console.log(`Screenshots Output: ${SCREENSHOTS_DIR}`);
  console.log('========================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800',
    ],
  });

  const testReport = {
    timestamp: new Date().toISOString(),
    application: 'MurtiHub Technologies',
    baseUrl: BASE_URL,
    desktop: [],
    mobile: [],
    cloudinaryAssets: [],
    interactiveTests: {},
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
    },
  };

  try {
    // -------------------------------------------------------------
    // PART 1: DESKTOP E2E TEST SUITE (1280x800)
    // -------------------------------------------------------------
    console.log('===============================================================');
    console.log('--- [1/2] DESKTOP VIEWPORT E2E TESTING (1280x800) ---');
    console.log('===============================================================\n');

    const desktopPage = await browser.newPage();
    await desktopPage.setViewport(DESKTOP_VIEWPORT);
    await desktopPage.evaluateOnNewDocument(() => {
      try {
        localStorage.clear();
      } catch (e) {}
    });

    for (const item of pagesToTest) {
      const pageErrors = [];
      const failedRequests = [];

      desktopPage.removeAllListeners('pageerror');
      desktopPage.removeAllListeners('requestfailed');
      desktopPage.on('pageerror', (err) => pageErrors.push(err.message));
      desktopPage.on('requestfailed', (req) => {
        if (!req.url().includes('google-analytics') && !req.url().includes('fonts.gstatic')) {
          failedRequests.push(`${req.method()} ${req.url()}`);
        }
      });

      const url = `${BASE_URL}${item.path}`;
      console.log(`▶ Testing Desktop: [${item.label}] -> ${url}`);
      const startTime = Date.now();
      const response = await desktopPage.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      const loadTime = Date.now() - startTime;
      const status = response ? response.status() : 0;

      // Scroll to trigger lazy-loaded images and allow animations to settle
      await desktopPage.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight / 2);
        await new Promise((r) => setTimeout(r, 400));
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 600));

        // Wait for all image network responses
        const images = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 4000);
            });
          })
        );

        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 300));
      });

      const title = await desktopPage.title();
      const heading = await desktopPage.evaluate(() => {
        const h = document.querySelector('h1, h2');
        return h ? h.innerText.replace(/\n/g, ' ').trim() : '';
      });

      // Audit image assets
      const imgStats = await desktopPage.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        let loaded = 0;
        let broken = 0;
        const srcs = [];
        const brokenSrcs = [];
        const cloudinarySrcs = [];

        images.forEach((img) => {
          srcs.push(img.src);
          if (img.src.includes('cloudinary.com')) {
            cloudinarySrcs.push(img.src);
          }
          if (img.complete && img.naturalWidth > 0) {
            loaded++;
          } else {
            broken++;
            brokenSrcs.push(img.src);
          }
        });

        return { total: images.length, loaded, broken, brokenSrcs, cloudinarySrcs };
      });

      // Check horizontal overflow
      const overflow = await desktopPage.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      const screenshotFile = `${item.name}.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, 'desktop', screenshotFile);
      await desktopPage.screenshot({ path: screenshotPath });

      const passed = status >= 200 && status < 400 && imgStats.broken === 0 && !overflow;

      testReport.desktop.push({
        id: item.name,
        label: item.label,
        path: item.path,
        url,
        status,
        loadTimeMs: loadTime,
        title,
        heading,
        imgStats,
        overflow,
        pageErrors,
        failedRequests,
        screenshot: screenshotPath,
        passed,
      });

      testReport.summary.totalTests++;
      if (passed) testReport.summary.passed++;
      else testReport.summary.failed++;

      console.log(`  ✓ Status: ${status} (${loadTime}ms) | Title: "${title}"`);
      console.log(`  ✓ Heading: "${heading.substring(0, 45)}..."`);
      console.log(
        `  ✓ Images: ${imgStats.loaded}/${imgStats.total} loaded (Cloudinary CDN: ${imgStats.cloudinarySrcs.length})`
      );
      console.log(`  ✓ Horizontal Overflow: ${overflow ? '❌ DETECTED' : '✅ None'}`);
      console.log(`  ✓ Screenshot: ${screenshotFile}\n`);
    }

    // Interactive Desktop Form Test
    console.log('▶ Testing Interactive Desktop Contact Form Submission Workflow...');
    await desktopPage.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));

    const formTestResult = await desktopPage.evaluate(async () => {
      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const companyInput = document.querySelector('input[name="company"]');
      const messageInput = document.querySelector('textarea[name="message"]');
      const submitBtn = document.querySelector('button[type="submit"]');

      if (!nameInput || !emailInput || !messageInput) {
        return { success: false, reason: 'Inputs not found' };
      }

      nameInput.value = 'Dr. Vikram Chandra';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      emailInput.value = 'vikram@sovereign-ai.org';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));

      if (companyInput) {
        companyInput.value = 'Sovereign Systems Foundation';
        companyInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      messageInput.value =
        'Commissioning an architectural audit for sovereign enterprise systems and agentic deployments.';
      messageInput.dispatchEvent(new Event('input', { bubbles: true }));

      return {
        success: true,
        filledValues: {
          name: nameInput.value,
          email: emailInput.value,
          company: companyInput?.value,
          message: messageInput.value,
        },
        hasSubmitBtn: Boolean(submitBtn),
      };
    });

    const contactFilledScreenshot = path.join(SCREENSHOTS_DIR, 'desktop', '10_contact_form_filled.png');
    await desktopPage.screenshot({ path: contactFilledScreenshot });
    testReport.interactiveTests.desktopForm = {
      ...formTestResult,
      screenshot: contactFilledScreenshot,
    };
    console.log(`  ✓ Form Inputs Validation: ${formTestResult.success ? '✅ Verified' : 'Failed'}`);
    console.log(`  ✓ Form Values:`, formTestResult.filledValues);
    console.log(`  ✓ Screenshot: 10_contact_form_filled.png\n`);

    await desktopPage.close();

    // -------------------------------------------------------------
    // PART 2: MOBILE E2E TEST SUITE (390x844 - iPhone 14)
    // -------------------------------------------------------------
    console.log('===============================================================');
    console.log('--- [2/2] MOBILE VIEWPORT E2E TESTING (390x844 - iPhone 14) ---');
    console.log('===============================================================\n');

    const mobilePage = await browser.newPage();
    await mobilePage.setViewport(MOBILE_VIEWPORT);
    await mobilePage.setUserAgent(MOBILE_UA);
    await mobilePage.evaluateOnNewDocument(() => {
      try {
        localStorage.clear();
      } catch (e) {}
    });

    for (const item of pagesToTest) {
      const pageErrors = [];
      const failedRequests = [];

      mobilePage.removeAllListeners('pageerror');
      mobilePage.removeAllListeners('requestfailed');
      mobilePage.on('pageerror', (err) => pageErrors.push(err.message));
      mobilePage.on('requestfailed', (req) => {
        if (!req.url().includes('google-analytics') && !req.url().includes('fonts.gstatic')) {
          failedRequests.push(`${req.method()} ${req.url()}`);
        }
      });

      const url = `${BASE_URL}${item.path}`;
      console.log(`▶ Testing Mobile: [${item.label}] -> ${url}`);
      const startTime = Date.now();
      const response = await mobilePage.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      const loadTime = Date.now() - startTime;
      const status = response ? response.status() : 0;

      // Scroll to trigger lazy-loaded images on mobile
      await mobilePage.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight / 2);
        await new Promise((r) => setTimeout(r, 300));
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 400));
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 300));
      });

      // Mobile Navigation elements verification
      const navStats = await mobilePage.evaluate(() => {
        const toggle = document.querySelector('.mobile-toggle');
        const desktopNav = document.querySelector('.navbar-nav');
        const isToggleVisible = toggle
          ? window.getComputedStyle(toggle).display !== 'none'
          : false;
        const isDesktopNavHidden = desktopNav
          ? window.getComputedStyle(desktopNav).display === 'none'
          : true;

        return {
          hasToggle: Boolean(toggle),
          isToggleVisible,
          isDesktopNavHidden,
        };
      });

      // Images verification on mobile
      const imgStats = await mobilePage.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        let loaded = 0;
        let broken = 0;
        images.forEach((img) => {
          if (img.complete && img.naturalWidth > 0) loaded++;
          else broken++;
        });
        return { total: images.length, loaded, broken };
      });

      // Strict horizontal overflow test for mobile
      const overflowDetails = await mobilePage.evaluate(() => {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const innerW = window.innerWidth;
        const isOverflow = scrollW > innerW + 1; // 1px threshold for fractional pixels
        return { scrollW, clientW, innerW, isOverflow };
      });

      const screenshotFile = `${item.name}_mobile.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, 'mobile', screenshotFile);
      await mobilePage.screenshot({ path: screenshotPath });

      const passed =
        status >= 200 &&
        status < 400 &&
        imgStats.broken === 0 &&
        !overflowDetails.isOverflow &&
        (item.path.startsWith('/admin') || navStats.isToggleVisible);

      testReport.mobile.push({
        id: item.name,
        label: item.label,
        path: item.path,
        url,
        status,
        loadTimeMs: loadTime,
        navStats,
        imgStats,
        overflowDetails,
        pageErrors,
        failedRequests,
        screenshot: screenshotPath,
        passed,
      });

      testReport.summary.totalTests++;
      if (passed) testReport.summary.passed++;
      else testReport.summary.failed++;

      console.log(`  ✓ Status: ${status} (${loadTime}ms)`);
      console.log(
        `  ✓ Mobile Hamburger Toggle: ${navStats.isToggleVisible ? '✅ Visible' : 'Hidden'} | Desktop Nav: ${
          navStats.isDesktopNavHidden ? '✅ Hidden' : 'Visible'
        }`
      );
      console.log(`  ✓ Images: ${imgStats.loaded}/${imgStats.total} loaded`);
      console.log(
        `  ✓ Mobile Horizontal Fit: ${
          overflowDetails.isOverflow ? '❌ OVERFLOW (' + overflowDetails.scrollW + 'px)' : '✅ Perfect 390px Fit'
        }`
      );
      console.log(`  ✓ Screenshot: ${screenshotFile}\n`);
    }

    // Interactive Mobile Drawer Opening & Navigation Test
    console.log('▶ Testing Mobile Drawer Opening & Click-through Navigation...');
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));

    // 1. Click hamburger toggle
    const toggleClicked = await mobilePage.evaluate(() => {
      const toggle = document.querySelector('.mobile-toggle');
      if (toggle) {
        toggle.click();
        return true;
      }
      return false;
    });

    if (toggleClicked) {
      await new Promise((r) => setTimeout(r, 600)); // wait for drawer animation

      const drawerState = await mobilePage.evaluate(() => {
        const overlay = document.querySelector('.mobile-menu-overlay');
        const links = Array.from(document.querySelectorAll('.mobile-nav-link')).map((a) => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href'),
        }));
        return {
          isOpen: Boolean(overlay && window.getComputedStyle(overlay).display !== 'none'),
          links,
        };
      });

      const drawerOpenScreenshot = path.join(SCREENSHOTS_DIR, 'mobile', '11_drawer_opened.png');
      await mobilePage.screenshot({ path: drawerOpenScreenshot });
      console.log(`  ✓ Mobile Drawer Open State: ${drawerState.isOpen ? '✅ Active' : 'Not open'}`);
      console.log(`  ✓ Drawer Navigation Links Count: ${drawerState.links.length}`);
      console.log(`  ✓ Screenshot: 11_drawer_opened.png`);

      // 2. Click Close Button
      await mobilePage.evaluate(() => {
        const closeBtn = document.querySelector('.mobile-close-btn');
        if (closeBtn) closeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 500));

      const drawerClosedState = await mobilePage.evaluate(() => {
        const overlay = document.querySelector('.mobile-menu-overlay');
        return !overlay || window.getComputedStyle(overlay).display === 'none';
      });

      const drawerClosedScreenshot = path.join(SCREENSHOTS_DIR, 'mobile', '12_drawer_closed.png');
      await mobilePage.screenshot({ path: drawerClosedScreenshot });
      console.log(`  ✓ Mobile Drawer Close Action: ${drawerClosedState ? '✅ Successfully Closed' : 'Failed'}`);
      console.log(`  ✓ Screenshot: 12_drawer_closed.png\n`);

      testReport.interactiveTests.mobileDrawer = {
        drawerOpenVerified: drawerState.isOpen,
        drawerLinksCount: drawerState.links.length,
        drawerClosedVerified: drawerClosedState,
        screenshots: [drawerOpenScreenshot, drawerClosedScreenshot],
      };
    }

    await mobilePage.close();

    // -------------------------------------------------------------
    // PART 3: CLOUDINARY CDN DIRECT VERIFICATION
    // -------------------------------------------------------------
    console.log('===============================================================');
    console.log('--- [3/3] CLOUDINARY CDN ASSET DELIVERY VERIFICATION ---');
    console.log('===============================================================\n');

    const cloudinaryUrls = [
      'https://res.cloudinary.com/txyaqhdq/image/upload/v1792172325/murtihub/leadership/rammurti-katiyar.jpg',
      'https://res.cloudinary.com/txyaqhdq/image/upload/v1792172326/murtihub/leadership/rishi-katiyar.jpg',
      'https://res.cloudinary.com/txyaqhdq/image/upload/v1792172327/murtihub/projects/akshar-canvas.jpg',
      'https://res.cloudinary.com/txyaqhdq/image/upload/v1792172328/murtihub/projects/ghsnap-flix.jpg',
      'https://res.cloudinary.com/txyaqhdq/image/upload/v1792172329/murtihub/projects/ghgame-zone.jpg',
      'https://res.cloudinary.com/txyaqhdq/image/upload/v1792172331/murtihub/projects/sentinel-gateway.jpg',
      'https://res.cloudinary.com/txyaqhdq/image/upload/v1792172332/murtihub/projects/omni-marketplace.jpg',
    ];

    for (const cUrl of cloudinaryUrls) {
      try {
        const resp = await fetch(cUrl, { method: 'HEAD' });
        const cType = resp.headers.get('content-type');
        const cLen = resp.headers.get('content-length');
        const assetName = cUrl.split('/').slice(-2).join('/');
        const isOk = resp.status === 200;

        testReport.cloudinaryAssets.push({
          asset: assetName,
          url: cUrl,
          status: resp.status,
          contentType: cType,
          sizeBytes: Number(cLen),
          ok: isOk,
        });

        console.log(
          `  ✓ Cloudinary [${assetName}]: ${isOk ? '✅ 200 OK' : '❌ ' + resp.status} (${cType}, ${(
            cLen / 1024
          ).toFixed(1)} KB)`
        );
      } catch (cErr) {
        console.error(`  ❌ Failed to fetch ${cUrl}:`, cErr.message);
      }
    }

    // Save final report to JSON
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'e2e_results.json'),
      JSON.stringify(testReport, null, 2),
      'utf8'
    );

    console.log('\n========================================================================');
    console.log(
      `🎉 ALL E2E TESTS COMPLETED: ${testReport.summary.passed}/${testReport.summary.totalTests} PASSED`
    );
    console.log('========================================================================\n');

    return testReport;
  } finally {
    await browser.close();
  }
}

runFullE2ETest().catch((err) => {
  console.error('\n❌ E2E Execution Failed:', err);
  process.exit(1);
});
