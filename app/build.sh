cp .npmrc.example .npmrc
sed -i -e "s/XXXX/$FONT_AWESOME_AUTH_TOKEN/g" .npmrc
tsc && vite build