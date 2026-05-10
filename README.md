# Signatures email — Karré Production / Tomber des Nues / Piano Service

Site GitHub Pages : https://morganrxl.github.io/signatures/

## Workflow

1. `node build.js` régénère `/docs/` (assets optimisés + 11 signatures HTML + index)
2. `git add docs && git commit && git push`
3. GitHub Pages sert depuis `main` → `/docs`

## Structure

```
sign/                       # source brute (hors repo, sur Desktop)
docs/
  index.html                # liste avec boutons Copier
  .nojekyll
  assets/                   # photos JPG grayscale + logos PNG
  signatures/               # 11 .html standalone, HTML inline pour copier-coller mail
build.js                    # script de génération
```

## Ajouter une signature

Éditer `MEMBERS` dans `build.js`, ajouter la photo source dans `~/Desktop/sign/`, mettre à jour `PHOTO_MAP`, relancer `node build.js`.
