# Enercyra market and energy source review

## Current product inputs

The Result page currently uses the attached EcoSyncAI notebook as a clearly labeled reference scenario. For the mapped Plastic_Products row, the notebook supplies an indicative price of **4 EGP/kg** and an LHV of **35 MJ/kg**. Enercyra calculates total energy as `weight_kg × LHV_MJ_per_kg`, then converts MJ to kWh by dividing by 3.6. These values are not a live Egyptian market quote, a laboratory measurement, or a universal value for all plastic types.

## External sources reviewed

| Source | What it provides | Unit/context | Safe use in Enercyra |
|---|---|---|---|
| [Forest Research — Typical calorific values of fuels](https://www.forestresearch.gov.uk/tools-and-resources/fthr/biomass-energy-resources/reference-biomass/facts-figures/typical-calorific-values-of-fuels/) | Defines net calorific value / LHV and publishes example fuel values | GJ/tonne and kWh/kg; moisture conditions are stated for biomass | Use as an explanation of LHV terminology and unit conversion, not as a direct plastic or paper row |
| [AluminumIndex Egypt](https://aluminumindexegypt.com/) | Monthly historical aluminum-can scrap prices | EGP/kg; January 2015–December 2025; collected from offline market sources, scrapyards, and factories | Potential aluminum-only market reference, but it is an independent industry dataset and needs provenance/refresh/approval fields |
| [EPA — National Overview: Materials, Wastes, and Recycling](https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/national-overview-facts-and-figures-materials) | U.S. waste-material context and recycling statistics | U.S.-specific, not an Egyptian price series | Context only; not a local price input |

## Decision

Do not silently replace the notebook rows with internet values. The sources do not provide a single current, grade-specific, Egypt-wide price series for all 37 model classes. The UI therefore labels notebook numbers as **EcoSyncAI Reference Estimates**, exposes the LHV unit, and warns that country, material grade, moisture, and date must be confirmed before commercial use. A future approved catalog should store `country`, `market`, `material_grade`, `observed_at`, `currency`, `price_unit`, `source_url`, `source_method`, and `approval_status` for each row.

## Important interpretation

LHV means the net calorific value after excluding recovery of the latent heat of water vapor from combustion. A displayed kWh value is an energy-equivalent conversion, not a guarantee of electricity generation; actual delivered electricity would also depend on conversion efficiency and the technology used.
