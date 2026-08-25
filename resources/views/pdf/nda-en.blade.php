<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Non-Disclosure Agreement (NDA) - Treetino corp s.r.o.</title>
    <style>
        @page {
            margin: 13mm 14mm 13mm 14mm;
        }

        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 7.6pt;
            line-height: 1.28;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
        }

        /* Running Header & Footer */
        .page-header {
            position: fixed;
            top: -10mm;
            left: 0;
            right: 0;
            height: 8mm;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 1mm;
        }

        .page-header table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-logo {
            height: 14px;
            vertical-align: middle;
        }

        .header-title {
            text-align: right;
            font-size: 6.2pt;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            vertical-align: middle;
            font-weight: bold;
        }

        .page-footer {
            position: fixed;
            bottom: -10mm;
            left: 0;
            right: 0;
            height: 7mm;
            border-top: 1px solid #cbd5e1;
            padding-top: 1.2mm;
        }

        .page-footer table {
            width: 100%;
            border-collapse: collapse;
            font-size: 6.2pt;
            color: #64748b;
        }

        .footer-left {
            text-align: left;
        }

        .footer-center {
            text-align: center;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .footer-right {
            text-align: right;
        }

        .page-number:before {
            content: "Page " counter(page);
        }

        /* Document Title */
        .doc-header {
            text-align: center;
            margin-top: 0;
            margin-bottom: 2mm;
            padding-bottom: 1.5mm;
            border-bottom: 1.5px solid #0284c7;
        }

        .doc-badge {
            display: inline-block;
            font-size: 6pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #0284c7;
            background: #e0f2fe;
            padding: 1.5px 6px;
            border-radius: 3px;
            margin-bottom: 1px;
        }

        .doc-title {
            font-size: 10.5pt;
            font-weight: bold;
            color: #0f172a;
            margin: 1.5px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            line-height: 1.15;
        }

        .doc-subtitle {
            font-size: 6.8pt;
            color: #475569;
            margin: 0;
            font-style: italic;
        }

        /* Section & Article Headings */
        h2.article-title {
            font-size: 7.8pt;
            font-weight: bold;
            color: #0f172a;
            margin-top: 2mm;
            margin-bottom: 1mm;
            padding-bottom: 0.5mm;
            border-bottom: 1px solid #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            page-break-after: avoid;
        }

        p {
            margin: 0 0 1mm 0;
            text-align: justify;
        }

        p.clause {
            margin-bottom: 1mm;
        }

        ul, ol {
            margin: 0 0 1mm 0;
            padding-left: 3.5mm;
        }

        li {
            margin-bottom: 0.6mm;
            text-align: justify;
        }

        /* Parties Box Grid */
        .parties-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 2.5mm 0;
            margin-bottom: 1.5mm;
            page-break-inside: avoid;
        }

        .party-col {
            width: 50%;
            vertical-align: top;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 1.8mm 2.2mm;
            font-size: 6.9pt;
            line-height: 1.25;
        }

        .party-col.provider {
            border-left: 3px solid #0284c7;
        }

        .party-col.recipient {
            border-left: 3px solid #0284c7;
            background: #fafaf9;
        }

        .party-heading {
            font-size: 7.4pt;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 1mm;
            padding-bottom: 0.6mm;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
        }

        .party-row {
            margin-bottom: 0.5mm;
        }

        .party-label {
            color: #64748b;
            font-size: 6.5pt;
            display: inline-block;
            width: 28mm;
            font-weight: bold;
        }

        .party-value {
            color: #0f172a;
            font-weight: bold;
        }

        .fill-field {
            margin-bottom: 0.8mm;
        }

        .fill-field-label {
            font-size: 6pt;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
        }

        .fill-field-dots {
            border-bottom: 1px dotted #64748b;
            height: 8px;
            margin-top: 0.3px;
        }

        /* Signatures Section */
        .signatures-container {
            margin-top: 2.5mm;
            page-break-inside: avoid;
        }

        .signatures-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 2.5mm 0;
        }

        .signature-box {
            width: 50%;
            vertical-align: top;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 1.8mm 2.2mm;
            background: #ffffff;
            font-size: 6.9pt;
            line-height: 1.3;
        }

        .sig-header {
            font-weight: bold;
            font-size: 7.3pt;
            color: #0f172a;
            margin-bottom: 1mm;
            padding-bottom: 0.6mm;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
        }

        /* Digital Signature Box */
        .digi-sig-box {
            border: 1px solid #93c5fd;
            background: #f0f9ff;
            border-radius: 3px;
            padding: 1.5mm 2mm;
            margin: 1mm 0;
        }

        .digi-sig-table {
            width: 100%;
            border-collapse: collapse;
        }

        .digi-name {
            font-size: 10pt;
            font-weight: bold;
            color: #0f172a;
            line-height: 1.05;
            vertical-align: middle;
            width: 40%;
        }

        .digi-meta {
            font-size: 5.8pt;
            color: #334155;
            line-height: 1.25;
            vertical-align: middle;
            border-left: 1px solid #bae6fd;
            padding-left: 2mm;
        }

        .partner-sig-space {
            height: 13mm;
            position: relative;
            margin: 1mm 0;
            border-bottom: 1px dashed #94a3b8;
            text-align: center;
        }

        .sig-stamp-text {
            font-size: 5.8pt;
            color: #94a3b8;
            padding-top: 4.5mm;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .sig-meta {
            margin-top: 1mm;
            font-size: 6.7pt;
            color: #475569;
            line-height: 1.3;
        }
    </style>
</head>
<body>

    <!-- Running Header -->
    <div class="page-header">
        <table>
            <tr>
                <td>
                    <img src="{{ public_path('img/branding/logo-type.svg') }}" class="header-logo" alt="Treetino">
                </td>
                <td class="header-title">
                    Non-Disclosure Agreement (NDA) &bull; Sales Partner
                </td>
            </tr>
        </table>
    </div>

    <!-- Running Footer -->
    <div class="page-footer">
        <table>
            <tr>
                <td class="footer-left">
                    Treetino corp s.r.o. | Reg. No. (IČO): 10800107
                </td>
                <td class="footer-center">
                    CONFIDENTIAL / STRICTLY PRIVATE
                </td>
                <td class="footer-right">
                    <span class="page-number"></span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Document Header -->
    <div class="doc-header">
        <div class="doc-badge">Legal Document &bull; Non-Disclosure Agreement (NDA)</div>
        <div class="doc-title">Non-Disclosure and Confidentiality Agreement</div>
        <div class="doc-subtitle">
            entered into pursuant to Section 1746(2) and Section 1730 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended
        </div>
    </div>

    <!-- Article I -->
    <h2 class="article-title">I. Contracting Parties</h2>

    <p style="margin-bottom: 1.2mm;">On the date, month, and year indicated below, the following Contracting Parties enter into this Non-Disclosure and Confidentiality Agreement (hereinafter the &bdquo;<strong>Agreement</strong>&ldquo;):</p>

    <table class="parties-table">
        <tr>
            <!-- Disclosing Party -->
            <td class="party-col provider">
                <div class="party-heading">1.1 Disclosing Party (Treetino)</div>
                <div class="party-row"><span class="party-label">Company Name:</span><span class="party-value">Treetino corp s.r.o.</span></div>
                <div class="party-row"><span class="party-label">Company ID (IČO):</span><span class="party-value">10800107</span></div>
                <div class="party-row"><span class="party-label">Registered Seat:</span><span class="party-value">Vlčetín 62, Bílá 463 43, Czechia</span></div>
                <div class="party-row"><span class="party-label">Represented by:</span><span class="party-value">Dominik Mašek, Managing Director</span></div>
                <div class="party-row"><span class="party-label">Registry:</span><span class="party-value">Regional Court in Ústí n. L., C 48430</span></div>
                <div class="party-row"><span class="party-label">Email:</span><span class="party-value">info@treetino.com</span></div>
                <div class="party-row" style="margin-top: 0.6mm; font-size: 6.2pt; color: #64748b; font-style: italic;">
                    (hereinafter referred to as the &bdquo;<strong>Disclosing Party</strong>&ldquo; or &bdquo;<strong>Treetino</strong>&ldquo;)
                </div>
            </td>

            <!-- Receiving Party -->
            <td class="party-col recipient">
                <div class="party-heading">1.2 Receiving Party (Commercial Partner / Agent)</div>
                
                <div class="fill-field">
                    <div class="fill-field-label">Company Name / Full Legal Name:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">Reg. No. / Tax ID / Date of Birth:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">VAT ID (if applicable):</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">Registered Office / Address:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">Represented by / Authorized Person:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">Email & Telephone Number:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field" style="margin-bottom: 0;">
                    <div class="fill-field-label">Bank Account / IBAN / SWIFT:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="party-row" style="margin-top: 0.6mm; font-size: 6.2pt; color: #64748b; font-style: italic;">
                    (hereinafter referred to as the &bdquo;<strong>Receiving Party</strong>&ldquo; or &bdquo;<strong>Commercial Partner</strong>&ldquo;)
                </div>
            </td>
        </tr>
    </table>

    <p style="font-size: 6.5pt; color: #64748b; margin-bottom: 1.5mm;">
        (The Disclosing Party and the Receiving Party hereinafter collectively referred to as the &bdquo;<strong>Parties</strong>&ldquo;, or individually as a &bdquo;<strong>Party</strong>&ldquo;)
    </p>

    <!-- Article II -->
    <h2 class="article-title">II. Preamble and Purpose of the Agreement</h2>
    
    <p class="clause"><strong>2.1</strong> The Parties are engaged in mutual negotiations regarding the establishment and execution of commercial and technical collaboration, within which the Receiving Party, acting as a sales representative, commercial agent, distributor, or partner entity, will conduct business development activities, specifically identifying commercial opportunities, mediating sales, presenting, marketing, and securing distribution or installation of Treetino products and technologies (including autonomous solar and wind trees Treetino V1, Treetino V2, vertical wind microturbines T1, and related accessories), as well as utilizing Treetino's proprietary sales and calculation software (Treetino Pricing App, CRM, partner portal, and 3D configuration tools) – hereinafter referred to as &bdquo;<strong>Mutual Collaboration</strong>&ldquo;.</p>

    <p class="clause"><strong>2.2</strong> For the purpose of negotiating and performing the Mutual Collaboration, the Disclosing Party will provide the Receiving Party with highly confidential commercial, pricing, technical, developmental, strategic, customer, and operational information and know-how, which constitute valuable trade secrets and intellectual property of the Disclosing Party and hold essential economic and competitive value.</p>

    <p class="clause"><strong>2.3</strong> The purpose of this Agreement is to establish binding rules and legal framework for the protection of all Confidential Information and Trade Secrets of the Disclosing Party, define the Receiving Party's obligations in handling such information, prohibit any unauthorized disclosure, dissemination, or utilization thereof, and determine legal remedies and sanctions in the event of any breach.</p>

    <!-- Article III -->
    <h2 class="article-title">III. Definition of Confidential Information and Trade Secrets</h2>

    <p class="clause"><strong>3.1</strong> &bdquo;<strong>Confidential Information</strong>&ldquo; for the purposes of this Agreement means any and all information, facts, data, documents, materials, designs, analyses, and know-how of any nature (technical, commercial, pricing, financial, legal, manufacturing, strategic, operational, or organizational), in tangible or intangible form, regardless of the manner or medium of transmission (oral, written, electronic, CAD/3D models, drawings, source/binary code, demonstration of prototypes, or software), that the Disclosing Party has directly or indirectly disclosed, provided, or made accessible to the Receiving Party, or of which the Receiving Party became aware in connection with the negotiations or Mutual Collaboration (hereinafter &bdquo;<strong>Confidential Information</strong>&ldquo;).</p>

    <p class="clause"><strong>3.2</strong> Confidential Information and <strong>Trade Secrets</strong> within the meaning of Section 504 and Section 1730 of the Civil Code include, without limitation:</p>
    <ul>
        <li><strong>Commercial, pricing, and financial data:</strong> wholesale/retail price lists, margin and discount structures, sales representative commission schedules and compensation models, calculation matrices and formulas, customized quotes prepared for clients, commercial and marketing strategies, sales pipeline, and expansion plans;</li>
        <li><strong>Customer and partner records:</strong> database of client inquiries, contact details and identities of existing and prospective customers, sales leads, negotiation history, CRM records, and terms negotiated with suppliers and sub-contractors;</li>
        <li><strong>Technical documentation and know-how:</strong> engineering drawings, 3D CAD models, electrical wiring schematics, technical specifications of solar/wind trees, composite material specifications, aerodynamic profiles of microturbines, inverter integration, electronic controllers, and battery energy storage systems;</li>
        <li><strong>Software, digital assets, and system credentials:</strong> source and binary code, database schemas, web and cloud applications (specifically Treetino Pricing / Sales App), API endpoints, and all user credentials (usernames, passwords, API tokens, and certificates) issued to the Receiving Party;</li>
        <li><strong>Strategic and legal assets:</strong> information regarding pending patents, utility and industrial designs, investment discussions, corporate partnerships, and internal standard operating procedures.</li>
    </ul>

    <p class="clause"><strong>3.3</strong> Confidential Information also includes the very existence of this Agreement, the fact that negotiations are taking place between the Parties, and all terms and parameters of the Mutual Collaboration.</p>

    <p class="clause"><strong>3.4</strong> All information specified in this Article is hereinafter collectively referred to as &bdquo;<strong>Protected Information</strong>&ldquo;. All information disclosed by the Disclosing Party shall be deemed Protected Information unless explicitly designated otherwise in writing by the Disclosing Party.</p>

    <!-- Article IV -->
    <h2 class="article-title">IV. Obligations of the Receiving Party and Data Protection</h2>

    <p class="clause"><strong>4.1</strong> The Receiving Party irrevocably covenants and agrees:</p>
    <ul>
        <li>To maintain the strictest confidentiality regarding all Protected Information and to protect it with the care of a prudent businessperson and the highest standard of professional diligence;</li>
        <li>To use the Protected Information exclusively for the performance of the agreed Mutual Collaboration and solely for the benefit of the Disclosing Party;</li>
        <li>Not to disclose, transfer, make accessible, disseminate, publish, or otherwise permit access to the Protected Information to any third party without the prior express written consent of the Disclosing Party;</li>
        <li>Not to utilize the Protected Information (including acquired know-how, calculation models, and customer databases) for its own commercial benefit or for the benefit of any third party, in particular not to engage in direct or indirect competitive activity against the Disclosing Party nor develop or offer competing technical or commercial solutions;</li>
        <li>Not to take any steps aimed at circumventing the Disclosing Party (<strong>non-circumvention obligation</strong>), in particular not to directly approach, contact, or solicit clients, prospects, or suppliers of the Disclosing Party discovered in the course of the Mutual Collaboration for the purpose of concluding transactions outside of the Disclosing Party.</li>
    </ul>

    <p class="clause"><strong>4.2 Access Restriction:</strong> The Receiving Party may disclose Protected Information solely to its statutory representatives, employees, and professional advisors who strictly need to know such information for the purposes of the Mutual Collaboration (<em>need-to-know basis</em>). The Receiving Party must ensure that such individuals are bound by confidentiality obligations at least as stringent as those contained herein, and the Receiving Party remains fully liable for any breach committed by such individuals as if it had committed the breach itself.</p>

    <p class="clause"><strong>4.3 Technical Security Measures:</strong> The Receiving Party undertakes to secure all devices (computers, smartphones, tablets) used to access the Disclosing Party's software and systems with strong passwords, biometric authentication, and two-factor authentication (2FA). The Receiving Party shall not share its credentials with any third party and shall not store Protected Information on public or unencrypted cloud storage.</p>

    <p class="clause"><strong>4.4 Notification Duty:</strong> In the event of discovering any unauthorized access, breach, leakage, loss, or disclosure of Protected Information, the Receiving Party shall immediately (and no later than within 24 hours) notify the Disclosing Party in writing and provide all necessary assistance to mitigate damages.</p>

    <!-- Article V -->
    <h2 class="article-title">V. Exceptions to Confidentiality Obligations</h2>

    <p class="clause"><strong>5.1</strong> The confidentiality obligation under this Agreement shall not apply to information that: (a) was demonstrably publicly known at the time of disclosure, or became publicly known subsequent to disclosure other than through a breach of this Agreement by the Receiving Party; (b) was demonstrably and lawfully in the possession of the Receiving Party prior to disclosure by the Disclosing Party; (c) was released from confidentiality by prior written consent of the Disclosing Party; (d) the Receiving Party is obligated to disclose pursuant to mandatory legal provisions, a binding court judgment, or an order of a law enforcement or public authority (provided that the Receiving Party shall immediately notify the Disclosing Party in advance in writing, disclose only the minimum required scope, and request confidential treatment).</p>

    <!-- Article VI -->
    <h2 class="article-title">VI. Intellectual Property and Return of Materials</h2>

    <p class="clause"><strong>6.1</strong> All intellectual property rights, trade secrets, patents, utility models, trademarks, copyrights, engineering designs, know-how, databases, and software tools remain the sole and exclusive property of the Disclosing Party. The provision of Protected Information conveys no license, patent right, or title to the Receiving Party.</p>

    <p class="clause"><strong>6.2 Return and Disposal of Materials:</strong> Upon written request by the Disclosing Party or at latest within 5 (five) business days following termination of the Mutual Collaboration, the Receiving Party shall return to the Disclosing Party all tangible materials, data carriers, drawings, samples, and documents containing Protected Information, and permanently and irrevocably erase/shred all digital copies and records from all its devices and servers.</p>

    <!-- Article VII -->
    <h2 class="article-title">VII. Contractual Penalty and Damages</h2>

    <p class="clause"><strong>7.1</strong> In the event of any breach by the Receiving Party of any obligation set forth in this Agreement (including breach of confidentiality, unauthorized disclosure, commercial misuse, breach of non-circumvention/non-compete covenants, or failure to return materials), the Receiving Party shall pay to the Disclosing Party a <strong>contractual penalty of €4,000 / CZK 100,000 (four thousand Euros / one hundred thousand Czech crowns)</strong> for each individual breach. In the case of a continuing breach, a contractual penalty of <strong>€200 / CZK 5,000</strong> shall be paid for each day or part thereof during which such breach continues.</p>

    <p class="clause"><strong>7.2</strong> The contractual penalty shall be due and payable within 14 (fourteen) calendar days following delivery of a written demand for payment to the Receiving Party.</p>

    <p class="clause"><strong>7.3 Damages:</strong> The agreement on and payment of a contractual penalty shall not affect or limit the Disclosing Party's right to full compensation for all damages, pecuniary and non-pecuniary losses, and lost profits in full. The Parties <strong>expressly exclude the application of Section 2050 of the Civil Code</strong> and agree that claims for damages remain enforceable in full alongside contractual penalties.</p>

    <!-- Article VIII -->
    <h2 class="article-title">VIII. Duration and Effectiveness</h2>

    <p class="clause"><strong>8.1</strong> This Agreement takes effect upon its signature by both Parties and is entered into for an <strong>indefinite term</strong>.</p>

    <p class="clause"><strong>8.2</strong> The confidentiality obligations regarding Protected Information shall survive and remain in effect throughout the duration of negotiations and Mutual Collaboration and for a period of <strong>5 (five) years</strong> following the termination of all collaboration; with respect to information constituting trade secrets or proprietary know-how of the Disclosing Party, confidentiality obligations shall survive indefinitely for as long as such trade secrets exist.</p>

    <!-- Article IX -->
    <h2 class="article-title">IX. Final Provisions</h2>

    <p class="clause"><strong>9.1</strong> Legal relations under this Agreement shall be governed by the laws of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code. Any disputes shall be submitted to the competent general courts of the Czech Republic having jurisdiction over the registered seat of the Disclosing Party.</p>

    <p class="clause"><strong>9.2</strong> Amendments to this Agreement must be made in writing in sequentially numbered addenda signed by both Parties. Should any provision be deemed invalid, the remaining provisions shall remain fully effective (severability clause).</p>

    <p class="clause"><strong>9.3</strong> This Agreement is executed in counterparts with the force of an original, or in an electronic format executed via recognized electronic signatures by both Parties.</p>

    <!-- Signature Clause -->
    <div class="signatures-container">
        <p style="margin-bottom: 2mm; font-size: 7.4pt; font-weight: bold;">
            In witness of their free, serious, and unambiguous intent, the Parties hereto attach their signatures:
        </p>

        <table class="signatures-table">
            <tr>
                <!-- Disclosing Party (Treetino with Dominik Mašek signature) -->
                <td class="signature-box">
                    <div class="sig-header">For Treetino corp s.r.o.</div>
                    
                    <div style="margin-top: 0.8mm; font-size: 7.2pt; color: #0f172a; font-weight: bold;">
                        Dominik Mašek
                    </div>
                    <div style="font-size: 6.8pt; color: #475569; margin-bottom: 1.2mm;">
                        In Prague / Bílá on: July 21, 2026
                    </div>

                    <!-- Actual Handwritten Signature Image -->
                    <div style="border: 1px dashed #94a3b8; border-radius: 4px; background: #fafafa; height: 16mm; text-align: center;">
                        <img src="{{ public_path('img/legal/dominik-signature.png') }}" style="height: 13mm; margin-top: 1.5mm;" alt="Dominik Mašek Signature">
                    </div>

                    <div class="sig-meta">
                        <strong>Dominik Mašek</strong><br>
                        Managing Director (CEO), Treetino corp s.r.o.
                    </div>
                </td>

                <!-- Receiving Party (Partner) -->
                <td class="signature-box">
                    <div class="sig-header">For Receiving Party</div>
                    
                    <div style="margin-top: 0.8mm; font-size: 7.2pt; color: #64748b; font-style: italic;">
                        [ Commercial Partner / Company ]
                    </div>
                    <div style="font-size: 6.8pt; color: #475569; margin-bottom: 1.2mm;">
                        In ........................................ on: ............................
                    </div>

                    <div class="partner-sig-space" style="border: 1px dashed #cbd5e1; border-radius: 4px; background: #fafafa; height: 16mm; text-align: center;">
                        <div class="sig-stamp-text">
                            [ Awaiting electronic or hand-written signature ]
                        </div>
                    </div>

                    <div class="sig-meta">
                        Full Name: .................................................<br>
                        Title / Authorization: .................................................
                    </div>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>
