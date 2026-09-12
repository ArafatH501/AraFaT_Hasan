using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

public class FastServer
{
    private HttpListener _listener;
    private string _root;

    public void Start(int port, string root)
    {
        _root = Path.GetFullPath(root);
        _listener = new HttpListener();
        _listener.Prefixes.Add("http://localhost:" + port + "/");
        _listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
        _listener.Start();
        Console.WriteLine("FastServer listening on http://localhost:" + port + "/");
        Task.Factory.StartNew(ListenLoop);
    }

    private void ListenLoop()
    {
        while (_listener.IsListening)
        {
            try
            {
                var context = _listener.GetContext();
                Task.Factory.StartNew(() => ProcessRequest(context));
            }
            catch
            {
                if (!_listener.IsListening) break;
            }
        }
    }

    private void ProcessRequest(HttpListenerContext context)
    {
        try
        {
            var raw = context.Request.Url.AbsolutePath.TrimStart('/');
            if (string.IsNullOrEmpty(raw)) raw = "index.html";
            var fullPath = Path.GetFullPath(Path.Combine(_root, Uri.UnescapeDataString(raw)));
            if (!fullPath.StartsWith(_root, StringComparison.OrdinalIgnoreCase) || !File.Exists(fullPath))
            {
                context.Response.StatusCode = 404;
                context.Response.Close();
                return;
            }

            var ext = Path.GetExtension(fullPath).ToLowerInvariant();
            string mime = "application/octet-stream";
            if (ext == ".html") mime = "text/html; charset=utf-8";
            else if (ext == ".css") mime = "text/css; charset=utf-8";
            else if (ext == ".js") mime = "application/javascript; charset=utf-8";
            else if (ext == ".png") mime = "image/png";
            else if (ext == ".jpg" || ext == ".jpeg") mime = "image/jpeg";
            else if (ext == ".webp") mime = "image/webp";
            else if (ext == ".otf") mime = "font/otf";
            else if (ext == ".ttf") mime = "font/ttf";
            else if (ext == ".woff") mime = "font/woff";
            else if (ext == ".woff2") mime = "font/woff2";
            else if (ext == ".mp4") mime = "video/mp4";

            context.Response.StatusCode = 200;
            context.Response.ContentType = mime;
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            // NEVER cache HTML, CSS, or JS during development; cache static fonts/images
            if (ext == ".html" || ext == ".css" || ext == ".js")
            {
                context.Response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
                context.Response.Headers.Add("Pragma", "no-cache");
                context.Response.Headers.Add("Expires", "0");
            }
            else
            {
                context.Response.Headers.Add("Cache-Control", "public, max-age=86400");
            }

            var fi = new FileInfo(fullPath);
            context.Response.ContentLength64 = fi.Length;

            if (context.Request.HttpMethod != "HEAD")
            {
                using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 65536))
                {
                    fs.CopyTo(context.Response.OutputStream);
                }
            }
            context.Response.OutputStream.Close();
        }
        catch
        {
            try { context.Response.Close(); } catch { }
        }
    }

    public void Stop()
    {
        try
        {
            _listener.Stop();
            _listener.Close();
        }
        catch { }
    }
}
