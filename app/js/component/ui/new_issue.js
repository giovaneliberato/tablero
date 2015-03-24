/*
* Copyright 2014 Thoughtworks Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
define([
  'flight/lib/component',
  'config/config_bootstrap',
  'component/mixins/repositories_urls',
  'component/mixins/with_auth_token_from_hash'
  ],
  function (defineComponent, config, repositoriesURLs, withAuthTokeFromHash) {
    var labels = config.getLabels();

    return defineComponent(component, repositoriesURLs, withAuthTokeFromHash);
    function component() {


      this.setUp = function (){
        var context = this;
        $("#create_issue").click(function () {

          if (!context.validIssueData()) {
            context.warnMissingData();
            return;
          }

          var selectedLabels = $("#labels").val();
          selectedLabels = ((selectedLabels != "") ? selectedLabels.split(",") : ["0 - Backlog"]);

          $(document).trigger('ui:create:issue', {
            'issueTitle': $("#issueTitle").val(),
            'issueBody': $("#issueBody").val(),
            'issueLabels': selectedLabels,
            'projectName': $("#projects").val()
          });

          $("#myModal").modal('hide');
          $("#myModal input, textarea").val('');
          _(selectedLabels).each(function(label) { 
            $('#labels').tagEditor('removeTag', label); 
          });
        });

        $("#projects").change(function () {
          $(document).trigger("ui:issue:createIssuesURL", $(this).val());
        });
      };

      this.validIssueData = function() {
        return !_.isEmpty($("#issueTitle").val());
      };

      this.warnMissingData = function() {
        $("#issueTitle").addClass('missing');
        $(".required-message").css('display', 'block');
      };

      this.addProjects = function() {
        
        var template = Hogan.compile('<option value="{{name}}">{{label}}</option>');
        $('#projects').empty();
        _(labels).each(function (label, name) {
            $("#projects").append(template.render({name: name, label: label}));
        }.bind(this));
      };

      this.after('initialize', function () {
        this.addProjects();
        this.setUp();
      });

    }
  }
);
