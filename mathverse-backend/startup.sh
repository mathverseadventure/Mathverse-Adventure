#!/bin/bash
cp /home/site/wwwroot/default /etc/nginx/sites-available/default
service nginx reload
cd /home/site/wwwroot
php artisan storage:link --force
php artisan config:cache
