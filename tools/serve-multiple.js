const http = require('http');
const fs = require('fs');
const path = require('path');

const designs = [
    { port: 2001, file: 'design-01.html' },
    { port: 2002, file: 'design-02.html' },
    { port: 2003, file: 'design-03.html' },
    { port: 2004, file: 'design-04.html' },
    { port: 2005, file: 'design-05.html' },
    { port: 2006, file: 'design-06.html' },
    { port: 2007, file: 'design-07.html' },
    { port: 2008, file: 'design-08.html' },
    { port: 2009, file: 'design-09.html' },
    { port: 2010, file: 'design-10.html' },
    { port: 2011, file: 'design-11.html' },
    { port: 2012, file: 'design-12.html' },
    { port: 2013, file: 'design-13.html' },
    { port: 2014, file: 'design-14.html' },
    { port: 2015, file: 'design-15.html' },
    { port: 2016, file: 'design-16.html' },
    { port: 2017, file: 'design-17.html' },
    { port: 2018, file: 'design-18.html' },
    { port: 2019, file: 'design-19.html' },
    { port: 2020, file: 'design-20.html' },
];

designs.forEach(({ port, file }) => {
    const server = http.createServer((req, res) => {
        const filePath = path.join(__dirname, '../design-previews', file);
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    });

    server.listen(port, () => {
        console.log(`Serving ${file} at http://localhost:${port}`);
    });
});