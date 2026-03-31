1:HL["/_next/static/media/e4af272ccee01ff0-s.p.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
2:HL["/_next/static/css/28fb6ab89bbaa364.css","style"]
0:["sTrNqFZoZggmM7UqkCDa4",[[["",{"children":["pipeline",{"children":["interested",{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],"$L3",[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/28fb6ab89bbaa364.css","precedence":"next"}]],"$L4"]]]]
6:I{"id":3654,"chunks":["185:static/chunks/app/layout-933eee3c22b1facf.js"],"name":"ThemeProvider","async":false}
7:I{"id":1443,"chunks":["272:static/chunks/webpack-478c5f80cad8caa9.js","971:static/chunks/fd9d1056-010fe255df1ad620.js","864:static/chunks/864-72f1e5d29f227d58.js"],"name":"","async":false}
8:I{"id":8639,"chunks":["272:static/chunks/webpack-478c5f80cad8caa9.js","971:static/chunks/fd9d1056-010fe255df1ad620.js","864:static/chunks/864-72f1e5d29f227d58.js"],"name":"","async":false}
4:[["$","meta","0",{"charSet":"utf-8"}],["$","title","1",{"children":"Dream Job App"}],["$","meta","2",{"name":"description","content":"From job search to hired — easy, fast, professional."}],["$","meta","3",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","4",{"name":"next-size-adjust"}]]
5:T201e,
(function () {
  try {
    var STORAGE_PALETTE = 'dja-palette';
    var STORAGE_MODE = 'dja-mode';
    var STORAGE_DARK_PALETTE = 'dja-dark-palette';

    var mode = localStorage.getItem(STORAGE_MODE) || 'light';
    var savedPalette = localStorage.getItem(STORAGE_PALETTE) || 'mono';
    var savedDarkPalette = localStorage.getItem(STORAGE_DARK_PALETTE) || 'mono';
    var root = document.documentElement;

    var palette = mode === 'light' ? 'mono' : savedDarkPalette;

    if (savedPalette && savedPalette !== 'mono') {
      savedDarkPalette = savedPalette;
      localStorage.setItem(STORAGE_DARK_PALETTE, savedDarkPalette);
      if (mode === 'dark') {
        palette = savedDarkPalette;
      }
    }

    var PALETTES = {
      'volt-green': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem'
        },
        dark: {
          background: '0 0% 10%',
          foreground: '0 0% 95%',
          card: '0 0% 12%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 11%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 8%',
          sidebarBorder: '0 0% 17%',
          primary: '71 100% 49%',
          primaryForeground: '0 0% 6%',
          secondary: '0 0% 16%',
          secondaryForeground: '0 0% 90%',
          muted: '0 0% 15%',
          mutedForeground: '0 0% 55%',
          accent: '0 0% 17%',
          accentForeground: '0 0% 95%',
          destructive: '0 80% 55%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 18%',
          input: '0 0% 14%',
          ring: '71 100% 49%',
          radius: '0.625rem'
        }
      },
      'volt-red': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem'
        },
        dark: {
          background: '0 0% 10%',
          foreground: '0 0% 95%',
          card: '0 0% 12%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 11%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 8%',
          sidebarBorder: '0 0% 17%',
          primary: '352 100% 52%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 16%',
          secondaryForeground: '0 0% 90%',
          muted: '0 0% 15%',
          mutedForeground: '0 0% 55%',
          accent: '0 0% 17%',
          accentForeground: '0 0% 95%',
          destructive: '0 80% 55%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 18%',
          input: '0 0% 14%',
          ring: '352 100% 52%',
          radius: '0.625rem'
        }
      },
      'volt-blue': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem',
          chart1: '0 0% 12%',
          chart2: '0 0% 24%',
          chart3: '0 0% 36%',
          chart4: '0 0% 52%',
          chart5: '0 0% 68%'
        },
        dark: {
          background: '0 0% 10%',
          foreground: '0 0% 95%',
          card: '0 0% 12%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 11%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 8%',
          sidebarBorder: '0 0% 17%',
          primary: '217 91% 55%',
          primaryForeground: '0 0% 100%',
          secondary: '217 30% 15%',
          secondaryForeground: '210 40% 90%',
          muted: '220 25% 14%',
          mutedForeground: '215 25% 58%',
          accent: '217 30% 16%',
          accentForeground: '210 40% 95%',
          destructive: '0 80% 60%',
          destructiveForeground: '0 0% 100%',
          border: '220 30% 16%',
          input: '220 30% 14%',
          ring: '217 91% 55%',
          radius: '0.625rem',
          chart1: '217 80% 60%',
          chart2: '172 66% 50%',
          chart3: '43 96% 56%',
          chart4: '142 76% 46%',
          chart5: '25 95% 60%'
        }
      },
      'mono': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem',
          chart1: '0 0% 12%',
          chart2: '0 0% 24%',
          chart3: '0 0% 36%',
          chart4: '0 0% 52%',
          chart5: '0 0% 68%'
        },
        dark: {
          background: '0 0% 4%',
          foreground: '0 0% 95%',
          card: '0 0% 7%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 6%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 5%',
          sidebarBorder: '0 0% 12%',
          primary: '0 0% 83%',
          primaryForeground: '0 0% 5%',
          secondary: '0 0% 13%',
          secondaryForeground: '0 0% 90%',
          muted: '0 0% 12%',
          mutedForeground: '0 0% 52%',
          accent: '0 0% 14%',
          accentForeground: '0 0% 95%',
          destructive: '0 70% 55%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 14%',
          input: '0 0% 12%',
          ring: '0 0% 70%',
          radius: '0.625rem',
          chart1: '0 0% 83%',
          chart2: '0 0% 68%',
          chart3: '0 0% 52%',
          chart4: '0 0% 36%',
          chart5: '0 0% 24%'
        }
      }
    };

    var paletteSet = PALETTES[palette] || PALETTES['mono'];
    var tokens = paletteSet[mode] || paletteSet.light;

    root.setAttribute('data-palette', palette);
    root.setAttribute('data-mode', mode);

    Object.keys(tokens).forEach(function (key) {
      var cssVar = '--' + key.replace(/[A-Z]/g, function (m) {
        return '-' + m.toLowerCase();
      });
      root.style.setProperty(cssVar, tokens[key]);
    });
  } catch (e) {}
})();
3:[null,["$","html",null,{"lang":"en","data-palette":"mono","data-mode":"light","suppressHydrationWarning":true,"children":[["$","head",null,{"children":["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$5"}}]}],["$","body",null,{"className":"__className_f367f3","children":["$","$L6",null,{"children":["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children"],"loading":"$undefined","loadingStyles":"$undefined","hasLoading":false,"error":"$undefined","errorStyles":"$undefined","template":["$","$L8",null,{}],"templateStyles":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[],"childProp":{"current":["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","pipeline","children"],"loading":"$undefined","loadingStyles":"$undefined","hasLoading":false,"error":"$undefined","errorStyles":"$undefined","template":["$","$L8",null,{}],"templateStyles":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","childProp":{"current":["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","pipeline","children","interested","children"],"loading":"$undefined","loadingStyles":"$undefined","hasLoading":false,"error":"$undefined","errorStyles":"$undefined","template":["$","$L8",null,{}],"templateStyles":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","childProp":{"current":["$L9","$La",null],"segment":"__PAGE__"},"styles":[]}],"segment":"interested"},"styles":[]}],"segment":"pipeline"},"styles":[]}]}]}]]}],null]
9:null
b:I{"id":5332,"chunks":["589:static/chunks/589-b71942607fd7f0dc.js","396:static/chunks/396-08685c64ba0c7e6e.js","713:static/chunks/713-0dd3b4d80fac1272.js","630:static/chunks/630-69085de49621cf6d.js","802:static/chunks/802-9c1f9f2d62e8ce24.js","332:static/chunks/332-85912ceb4107a7f7.js","323:static/chunks/app/pipeline/interested/page-c79eec9d8c93939a.js"],"name":"MainLayout","async":false}
c:I{"id":4724,"chunks":["589:static/chunks/589-b71942607fd7f0dc.js","396:static/chunks/396-08685c64ba0c7e6e.js","713:static/chunks/713-0dd3b4d80fac1272.js","630:static/chunks/630-69085de49621cf6d.js","802:static/chunks/802-9c1f9f2d62e8ce24.js","332:static/chunks/332-85912ceb4107a7f7.js","323:static/chunks/app/pipeline/interested/page-c79eec9d8c93939a.js"],"name":"","async":false}
a:["$","$Lb",null,{"children":["$","div",null,{"className":"page-container space-y-6","children":[["$","div",null,{"className":"space-y-4","children":[["$","$Lc",null,{"href":"/dashboard","className":"inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left h-4 w-4","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}],"Back to Dashboard"]}],["$","div",null,{"className":"flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between","children":[["$","div",null,{"children":[["$","div",null,{"className":"mb-1 flex items-center gap-2","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-briefcase-business h-5 w-5 text-primary","children":[["$","path","1mp3jc",{"d":"M12 12h.01"}],["$","path","1ksdt3",{"d":"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"}],["$","path","12hx5q",{"d":"M22 13a18.15 18.15 0 0 1-20 0"}],["$","rect","i6l2r4",{"width":"20","height":"14","x":"2","y":"6","rx":"2"}],"$undefined"]}],["$","h1",null,{"className":"text-2xl font-bold text-foreground","children":"Interested"}]]}],["$","p",null,{"className":"text-sm text-muted-foreground","children":"Listings you added and have not started working yet."}]]}],["$","div",null,{"className":"inline-flex w-fit items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground","children":[0," jobs"]}]]}]]}],["$","section",null,{"className":"rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center","children":[["$","h2",null,{"className":"text-lg font-semibold text-foreground","children":"No jobs here yet"}],["$","p",null,{"className":"mt-2 text-sm text-muted-foreground","children":"Listings you added and have not started working yet."}],["$","div",null,{"className":"mt-5 flex justify-center","children":["$","$Lc",null,{"href":"/jobs/new","className":"inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-plus h-4 w-4","children":[["$","path","1ays0h",{"d":"M5 12h14"}],["$","path","s699le",{"d":"M12 5v14"}],"$undefined"]}],"It's a Ghost Town Around Here...Add a New Job to Get Started"]}]}]]}]]}]}]
