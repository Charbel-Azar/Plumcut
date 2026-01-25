$content = Get-Content 'c:\Users\user\Documents\GitHub\Plumcut\services.html' -Raw -Encoding Unicode

$oldText = @"
          <ul class="max-sm:flex-col flex sm:items-start items-center gap-6 mb-14">
            <li data-ns-animate data-delay="0.5" class="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0"
              >
                <path
                  d="M15.1875 5.0625L7.3125 12.9371L3.375 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="stroke:#E65E04;"
                />
              </svg>
              <span class="font-medium text-tagline-1" style="color:#481D52;"
                >Works with Shopify, WooCommerce, and major e-commerce platforms</span
              >
            </li>
            <li data-ns-animate data-delay="0.6" class="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0"
              >
                <path
                  d="M15.1875 5.0625L7.3125 12.9371L3.375 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="stroke:#E65E04;"
                />
              </svg>
              <span class="font-medium text-tagline-1" style="color:#481D52;"
                >Syncs with Google Calendar, Calendly, and scheduling tools</span
              >
            </li>
            <li data-ns-animate data-delay="0.7" class="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0"
              >
                <path
                  d="M15.1875 5.0625L7.3125 12.9371L3.375 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="stroke:#E65E04;"
                />
              </svg>
              <span class="font-medium text-tagline-1" style="color:#481D52;"
                >Connects to HubSpot, Salesforce, and popular CRMs</span
              >
            </li>
          </ul>
"@

$newText = @"
          <ul class="max-sm:flex-col flex sm:items-start items-center gap-6 mb-14">
            <li data-ns-animate data-delay="0.5" class="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0"
              >
                <path
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                  stroke="#E65E04"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="font-medium text-tagline-1" style="color:#481D52;"
                >Works with Shopify, WooCommerce, and major e-commerce platforms</span
              >
            </li>
            <li data-ns-animate data-delay="0.6" class="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="#E65E04"
                  stroke-width="2"
                />
                <line x1="16" y1="2" x2="16" y2="6" stroke="#E65E04" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="#E65E04" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#E65E04" stroke-width="2"/>
              </svg>
              <span class="font-medium text-tagline-1" style="color:#481D52;"
                >Syncs with Google Calendar, Calendly, and scheduling tools</span
              >
            </li>
            <li data-ns-animate data-delay="0.7" class="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="shrink-0"
              >
                <path
                  d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                  stroke="#E65E04"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle cx="9" cy="7" r="4" stroke="#E65E04" stroke-width="2"/>
                <path
                  d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                  stroke="#E65E04"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="font-medium text-tagline-1" style="color:#481D52;"
                >Connects to HubSpot, Salesforce, and popular CRMs</span
              >
            </li>
          </ul>
"@

$content = $content.Replace($oldText, $newText)
Set-Content 'c:\Users\user\Documents\GitHub\Plumcut\services.html' -Value $content -Encoding Unicode -NoNewline

Write-Host "Icons updated successfully!"
