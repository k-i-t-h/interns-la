USE [C84_InternsLA]
GO

/****** Object:  StoredProcedure [dbo].[Openings_Update]    Script Date: 3/26/2020 12:11:07 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[Openings_Update] @Id             INT OUTPUT, 
                                   @OrganizationId INT, 
                                   @JobTypeId      INT, 
                                   @LocationId     INT, 
                                   @Title          NVARCHAR(200), 
                                   @Description    NVARCHAR(4000), 
                                   @Requirements   NVARCHAR(3000), 
                                   @IsActive       BIT, 
                                   @ContactName    NVARCHAR(100), 
                                   @ContactPhone   NVARCHAR(20), 
                                   @ContactEmail   NVARCHAR(200)
AS

/*

Declare
     @Id int = 26
	,@OrganizationId int = 4
	,@JobTypeId int  = 3
	,@LocationId int = 4
	,@CreatedBy int = 1
	,@Title nvarchar(200) = 'Data Analyst'
	,@Description nvarchar(4000) = 'Data analyst responsibilities include conducting full lifecycle analysis to include requirements, activities and design. Data analysts will develop analysis and reporting capabilities. They will also monitor performance and quality control plans to identify improvements.'
	,@Requirements nvarchar(3000) = 'Interpret data, analyze results using statistical techniques and provide ongoing reports. Develop and implement databases, data collection systems, data analytics and other strategies that optimize statistical efficiency and quality. Acquire data from primary or secondary data sources and maintain databases/data systems. Identify, analyze, and interpret trends or patterns in complex data sets. Filter and “clean” data by reviewing computer reports, printouts, and performance indicators to locate and correct code problems. Work with management to prioritize business and information needs. Locate and define new process improvement opportunities'
	,@IsActive bit = 1
	,@ContactName nvarchar(100) = 'John Doe'
	,@ContactPhone nvarchar(20) = '321-123-4321'
	,@ContactEmail nvarchar(200) = 'john.doe@email.com'

Execute [dbo].[Openings_Update]

	@Id OUTPUT
	, @OrganizationId
	, @JobTypeId
	, @LocationId
	, @CreatedBy
	, @Title
	, @Description
	, @Requirements
	, @IsActive
	, @ContactName
	, @ContactPhone
	, @ContactEmail

	select * from dbo.Openings
	Where Id = @Id;

 */

    BEGIN
        DECLARE @dateMod DATETIME2= GETUTCDATE();
        UPDATE dbo.Openings
          SET 
              [OrganizationId] = @OrganizationId, 
              [JobTypeId] = @JobTypeId, 
              [LocationId] = @LocationId, 
              [Title] = @Title, 
              [Description] = @Description, 
              [Requirements] = @Requirements, 
              [IsActive] = @IsActive, 
              [ContactName] = @ContactName, 
              [ContactPhone] = @ContactPhone, 
              [ContactEmail] = @ContactEmail, 
              [DateModified] = @dateMod
        WHERE Id = @Id;
    END;
GO

