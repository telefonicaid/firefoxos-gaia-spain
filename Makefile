APP_DIR=external-apps
PRELOAD_URL=https://raw.github.com/yurenju/gaia-preload-app/master/preload.py
PRELOAD_FILE=preload.py

apps:
	curl $(PRELOAD_URL) -o $(PRELOAD_FILE)
	cd $(APP_DIR); \
	for line in `cat list | awk 'BEGIN { FS = "," } ; { print $$2 }'`; do \
		python $(CURDIR)/$(PRELOAD_FILE) $$line; \
	done;
	rm $(PRELOAD_FILE)

clean:
	rm $(PRELOAD_FILE)
