distribution files for Telefonica customization build. we haven't support preload
apps so please copy external-apps/* to GAIA_DIR/external-apps

Instructions
============

just clone this repository, copy external-apps and make your production build
with official branding!

    $ git clone git://github.com/telefonicaid/firefoxos-gaia-spain.git <DIST_DIR>
    $ cp -r <DIST_DIR>/external-apps/* <GAIA_DIR>/external-apps/
    $ MOZILLA_OFFICIAL=1 GAIA_DISTRIBUTION_DIR=<DIST_DIR> make production
