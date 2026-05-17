#!/bin/bash
# Quick catalog freshness check — run before any data-dependent decision
MATRIX="brain/catalog_intelligence_matrix.json"
if [ ! -f "$MATRIX" ]; then
  echo "ERROR: catalog_intelligence_matrix.json not found"
  exit 1
fi
SNAPSHOT=$(grep -o '"snapshot_date":"[^"]*"' "$MATRIX" | head -1 | cut -d'"' -f4)
echo "Last catalog refresh: $SNAPSHOT"
DAYS_OLD=$(( ($(date +%s) - $(date -d "$SNAPSHOT" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$SNAPSHOT" +%s)) / 86400 ))
echo "Days since last refresh: $DAYS_OLD"
if [ "$DAYS_OLD" -gt 14 ]; then
  echo "WARNING: Catalog is stale (>14 days). Run: node brain/refresh-catalog.mjs"
fi
