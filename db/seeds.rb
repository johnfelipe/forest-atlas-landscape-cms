def clear
  Site.delete_all
  Page.delete_all
  Route.delete_all
  User.delete_all
  SiteTemplate.delete_all

  puts 'Database clear'
end

def create_templates
  @fa_template = SiteTemplate.create({ name: 'Forest Atlas'} )
  @la_template = SiteTemplate.create({ name: 'Landscape Application'} )
  @ca_template = SiteTemplate.create({ name: 'CARPE Landscape'} )

  @templates = [@fa_template, @la_template, @ca_template]
  puts 'Site templates created successfully'
end

def create_pages_templates
  home = PageTemplate.create!(
    {
      name: 'Homepage',
      description: 'Homepage description',
      uri: '',
      content_type: ContentType::HOMEPAGE,
      page_version: 2,
      site_templates: @templates,
      content: '[{"id":1532344156248,"type":"text","content":"<h1>The interactive forest atlas of Camaroon</h1><p>The Interactive forest atlas of Cameroon is a living, dynamic forest monitoring system that provides unbiased and up-to-date information on the Cameroon\'s forest sector. Built on a geographic information system (GIS) platform, the Atlas aims to strengthen forest management and land use planning by bringing information on all major land use categories onto the same standardized platform.</p><p>The underlying forest atlas database is supported and kept up-to-date by the Ministry of Water, Forests, Hunting and Fishing and the World Resources Institute (WRI), releasing new information as it becomes available via this&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">mapping application</a>. Other publications are released periodically and can be found in the&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">download section</a>.</p><p><br></p><p><br></p><blockquote><em>A key data challenge by integrating forest management classes with forest cover extent and change data from GFW’s near-real-time monitoring system</em></blockquote><p><br></p><p>Unless otherwise noted, Atlas data are licensed under a&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">Creative Commons Attribution 4.0</a>&nbsp;International License. You are free to copy and redistribute the material in any medium or format, and to transform and build upon the material for any purpose, even commercially. You must give appropriate credit, provide a link to the license, and indicate if changes were made. When displaying and citing the data, use the appropriate credit as listed for the corresponding dataset in the download section.</p>"}]'
    }
  )

  PageTemplate.create!(
    {
      name: 'Map',
      description: 'Explore the map',
      content: {settings: File.read(Dir.pwd + '/lib/tasks/map_config.json')},
      uri: 'map',
      parent: home,
      content_type: ContentType::MAP,
      site_templates: @templates
    }
  )

  PageTemplate.create!(
    {
      name: 'Terms and privacy',
      description: 'Terms and privacy',
      uri: PageTemplate::TERMS_OF_SERVICE_SLUG,
      parent: home,
      show_on_menu: false,
      content_type: ContentType::STATIC_CONTENT,
      site_templates: @templates,
      content: nil # content rendered from .erb template upon site creation
    }
  )

  PageTemplate.create!(
    {
      name: 'Privacy Policy',
      description: 'Privacy Policy',
      uri: PageTemplate::PRIVACY_POLICY_SLUG,
      parent: home,
      show_on_menu: false,
      content_type: ContentType::STATIC_CONTENT,
      site_templates: @templates,
      content: { json: File.read('lib/assets/privacy_policy_page.json') }
    }
  )
  puts 'Template pages created successfully'
end

clear
create_templates
create_pages_templates
