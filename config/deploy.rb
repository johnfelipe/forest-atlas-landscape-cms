# config valid only for current version of Capistrano
lock "3.7.0"

set :application, 'facms'
set :repo_url, 'git@github.com:Vizzuality/forest-atlas-landscape-cms.git'
set :deploy_user, 'ubuntu'
set :rvm_ruby_version, '2.3.1'
set :keep_releases, 5
set :use_sudo, true

set :linked_files, %w{.env}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

set :deploy_to, '/var/www/facms'

set :default_env, {
  NODE_ENV: 'production',
  NODE_OPTIONS: '--max_old_space_size=2048'
}

before 'deploy:publishing', 'site:create_assets'
before 'deploy:assets:precompile', 'node_modules:generate'

namespace :deploy do
  after :finishing, 'deploy:cleanup'
  after 'deploy:publishing', 'deploy:restart'

  namespace :site do
    task :create_assets do
      on roles(fetch(:assets_roles)) do
        within release_path do
          with rails_env: fetch(:rails_env) do
            execute(:rake, "site:create_assets")
          end
        end
      end
    end
  end

  namespace :node_modules do
    task :generate do
      on roles(fetch(:assets_roles)) do
        within release_path do
          with rails_env: fetch(:rails_env) do
            with node_env: 'production' do
              execute("cd #{release_path} && yarn")
              # execute(:rake, 'webpacker:compile')
            end
          end
        end
      end
    end
  end
end

