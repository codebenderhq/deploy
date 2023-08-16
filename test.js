import deploy from '../std/middleware/deploy.js'
 
Deno.serve({port:9001},deploy)