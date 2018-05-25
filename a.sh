#!/bin/bash

scp ./mp/shoujsData.js mai:/data/niudu/passwd/

ssh -t mai 'pm2 reload ssr-api'