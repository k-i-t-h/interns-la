USE [C84_InternsLA]
GO

/****** Object:  StoredProcedure [dbo].[Openings_Insert]    Script Date: 3/26/2020 12:06:51 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[Openings_Insert]
	
	@Id int OUTPUT
	, @OrganizationId int
	, @JobTypeId int 
	, @LocationId int
	, @CreatedBy int
	, @Title nvarchar(200)
	, @Description nvarchar(4000)
	, @Requirements nvarchar(3000)
	, @IsActive bit = 0
	, @ContactName nvarchar(100)
	, @ContactPhone nvarchar(20)
	, @ContactEmail nvarchar(200) 

AS

/*

Declare
     @Id int
	,@OrganizationId int = 4
	,@JobTypeId int  = 2
	,@LocationId int = 4
	,@CreatedBy int = 1
	,@Title nvarchar(200) = 'Software Engineer'
	,@Description nvarchar(4000) = 'The job of a Software Engineer depends on the needs of the company, organization or team they are on. Some build and maintain systems that run devices and networks. Others develop software that make it possible for people to perform specific tasks.'
	,@Requirements nvarchar(3000) = 'Bachelors Degree in Computer Science, related subject or work experience'
	,@IsActive bit = 1
	,@ContactName nvarchar(100) = 'John Doe'
	,@ContactPhone nvarchar(20) = '123-321-1234'
	,@ContactEmail nvarchar(200) = 'john.doe@email.com' 

Execute [dbo].[Openings_Insert]

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
	INSERT INTO dbo.Openings
	(
    [OrganizationId]
    ,[JobTypeId]
    ,[LocationId]
    ,[CreatedBy]
    ,[Title]
    ,[Description]
    ,[Requirements]
    ,[IsActive]
    ,[ContactName]
    ,[ContactPhone]
    ,[ContactEmail] )
	
  VALUES
	(@OrganizationId
	, @JobTypeId
	, @LocationId
	, @CreatedBy
	, @Title
	, @Description
	, @Requirements
	, @IsActive
	, @ContactName
	, @ContactPhone
	, @ContactEmail )

	SET @Id = SCOPE_IDENTITY()
END
GO

